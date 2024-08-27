import { Battle } from './Battle.js';
import {
  attackMessage,
  runMessage,
  possibleActionMessage,
  chooseAction,
  skillHealMessage,
} from './logs.js';
import {
  getMinToMax,
  getIsCritical,
  getCriticalDamage,
  getIsEvasion,
  getStageClearHeal,
  getStageBuffDamage,
  getSkillHeal,
  getMonsterHpBuff,
} from './utils.js';

export class Unit {
  constructor(name, hp, speed, evasion, criticalChance, criticalRatio, type) {
    this.name = name;
    this.hp = hp;
    this.speed = speed;
    this.evasion = evasion;
    this.criticalChance = criticalChance;
    this.criticalRatio = criticalRatio;
    this.unitType = type;
    this.isRun = false;
    this.isCritical = false;
    this.isEvasion = false;
  }

  async attack(attackType, target) {
    // 공격 대상이 회피하였는지 확인
    target.isEvasion = getIsEvasion(target.evasion);
    if (target.isEvasion === true) {
      return 0;
    } else if (target.isEvasion !== true) {
      let damage;
      // 크리티컬인지 확인
      this.isCritical = getIsCritical(this.criticalChance);

      // 크리티컬상황
      // 크리티컬은 항상 maxDamage에서 치명타배율이 들어가는 것으로 함
      if (this.isCritical) {
        damage = getCriticalDamage(this.criticalRatio, attackType.maxDamage);
      } else {
        damage = getMinToMax(attackType.minDamage, attackType.maxDamage);
      }

      target.hp -= damage;
      return damage;
    }
  }

  static stageDamageBuff(target, stage) {
    for (let idx in target.actionTypes) {
      if (target.actionTypes[idx].type === 'attack') {
        target.actionTypes[idx].minDamage += getStageBuffDamage(stage);
        target.actionTypes[idx].maxDamage += getStageBuffDamage(stage);
      }
    }
  }
}

export class Player extends Unit {
  constructor() {
    super('Violeto', 100, 60, 20, 20, 0.8, 'user');
    this.escapeChanceRatio = 20;
    this.actionTypes = [
      {
        name: '우아한 베기',
        type: 'attack',
        minDamage: 100,
        maxDamage: 200,
        cooltime: 0,
        currentCooltime: 0,
      },
      {
        name: '나비 가르기',
        type: 'attack',
        minDamage: 20,
        maxDamage: 30,
        cooltime: 7,
        currentCooltime: 0,
      },
      {
        name: '도망',
        type: 'run',
        cooltime: 0,
        currentCooltime: 0,
      },
    ];
  }

  // 도망치기
  tryRun() {
    const isEscape = Math.floor(Math.random() * 100);
    if (isEscape > this.escapeChanceRatio) {
      return false;
    } else return true;
  }

  stageClearHeal(stage) {
    const healAmount = getStageClearHeal(stage);
    this.hp += healAmount;
    return healAmount;
  }

  async action(player, monster, logs) {
    // 쿨타임인 행동을 제외하고 할 수 있는 행동을 정리한다.
    const actions = await Battle.checkPossibleAction(this);
    possibleActionMessage(actions);
    const choice = await chooseAction(actions, logs);

    const choiceAction = actions[choice - 1];
    // 플레이어의 선택에 따라 다음 행동 처리
    // 입력에 대한 행동을 키값으로 관리하는게 좋겠다고 판단
    if (choiceAction.type === 'attack') {
      const damage = await this.attack(choiceAction, monster);
      attackMessage(
        this,
        monster,
        logs,
        damage,
        choiceAction.name,
        this.isCritical,
        monster.isEvasion,
      );

      // 스킬을 사용한 경우
      if (choiceAction === this.actionTypes[1]) {
        // 스킬 쿨타임 적용 및 피해량에 따른 피 회복
        this.actionTypes[1].currentCooltime = this.actionTypes[1].cooltime;
        const skillHealAmount = getSkillHeal(damage);
        this.hp += skillHealAmount;
        skillHealMessage(this.actionTypes[1].name, skillHealAmount, logs);
      }
    }

    // 도망 시 로직 처리
    else if (choiceAction.type === 'run') {
      this.isRun = this.tryRun();
      runMessage(this.isRun, this.name, logs);
    }
  }
}

export class Monster extends Unit {
  constructor(name, hp, speed, evasion, criticalChance, criticalRatio, type, actionType) {
    super(name, hp, speed, evasion, criticalChance, criticalRatio, type, actionType);
    this.actionTypes = actionType;
  }

  // 몬스터를 생성하는 정적메서드
  static createMonster() {
    // 몬스터의 종류를 랜덤하게 지정하며 강할수록 출현확률이 낮음
    const monsterTypes = [
      {
        name: 'Goblin',
        hp: 50,
        speed: 60,
        evasion: 20,
        criticalChance: 5,
        criticalRatio: 0.3,
        type: 'enemy',
        emersionChance: 90,
        actionType: [
          {
            name: '찌르기',
            type: 'attack',
            minDamage: 5,
            maxDamage: 15,
            cooltime: 0,
            currentCooltime: 0,
          },
          {
            name: '모래뿌리기',
            type: 'attack',
            minDamage: 5,
            maxDamage: 10,
            cooltime: 3,
            currentCooltime: 0,
          },
        ],
      },
      {
        name: 'Orc',
        hp: 80,
        speed: 30,
        evasion: 10,
        criticalChance: 10,
        criticalRatio: 0.5,
        type: 'enemy',
        emersionChance: 30,
        actionType: [
          {
            name: '내려찍기',
            type: 'attack',
            minDamage: 15,
            maxDamage: 25,
            cooltime: 0,
            currentCooltime: 0,
          },
          {
            name: '땅찍기',
            type: 'attack',
            minDamage: 10,
            maxDamage: 20,
            cooltime: 3,
            currentCooltime: 0,
          },
        ],
      },
      {
        name: 'Wolf',
        hp: 40,
        speed: 90,
        evasion: 30,
        criticalChance: 30,
        criticalRatio: 0.3,
        type: 'enemy',
        emersionChance: 40,
        actionType: [
          {
            name: '물어뜯기',
            type: 'attack',
            minDamage: 10,
            maxDamage: 15,
            cooltime: 0,
            currentCooltime: 0,
          },
          {
            name: '힘줄끊기',
            type: 'attack',
            minDamage: 15,
            maxDamage: 20,
            cooltime: 3,
            currentCooltime: 0,
          },
        ],
      },
      {
        name: 'Dragon',
        hp: 200,
        speed: 30,
        evasion: 20,
        criticalChance: 10,
        criticalRatio: 0.7,
        type: 'enemy',
        emersionChance: 2,
        actionType: [
          {
            name: '날아찍기',
            type: 'attack',
            minDamage: 20,
            maxDamage: 35,
            cooltime: 0,
            currentCooltime: 0,
          },
          {
            name: '화염브레스',
            type: 'attack',
            minDamage: 30,
            maxDamage: 50,
            cooltime: 3,
            debuffDuration: 1,
          },
        ],
      },
    ];

    // 몬스터 생성이 되지 않았을 때 반복
    let isNotCreate = true;
    const setMonster = {};
    while (isNotCreate) {
      for (let idx in monsterTypes) {
        const monsterEmersionChance = monsterTypes[idx].emersionChance;
        const emersionRandomCount = Math.random() * 100;
        if (emersionRandomCount <= monsterEmersionChance) {
          Object.assign(setMonster, monsterTypes[idx]);
          isNotCreate = false;
        }
      }
    }

    // 몬스터 클래스 생성 반환
    return new Monster(
      setMonster.name,
      setMonster.hp,
      setMonster.speed,
      setMonster.evasion,
      setMonster.criticalChance,
      setMonster.criticalRatio,
      setMonster.type,
      setMonster.actionType,
    );
  }

  async action(player, monster, logs) {
    if (this.hp > 0) {
      // 쿨타임인 행동을 제외하고 할 수 있는 행동을 정리한다.
      const actions = await Battle.checkPossibleAction(monster);

      let attackIs = {};

      // 특수 공격 가능 여부를 확인
      if (actions[1] !== undefined) {
        const isSpecialAttack = Math.floor(Math.random() * 100);
        if (isSpecialAttack > 40) {
          attackIs = actions[1];
          this.actionTypes[1].currentCooltime = this.actionTypes[1].cooltime;
        } else {
          // 일반 공격
          attackIs = actions[0];
        }
      } else if (actions[0] !== undefined) {
        // 특수 공격이 불가능하고 일반 공격만 가능한 경우
        attackIs = actions[0];
      }

      // 공격 시작
      const damage = await this.attack(attackIs, player);
      attackMessage(
        monster,
        player,
        logs,
        damage,
        attackIs.name,
        this.isCritical,
        player.isEvasion,
      );
    }
  }

  stageHpBuff(stage) {
    const hpAmount = getMonsterHpBuff(this, stage);
    this.hp += hpAmount;
  }
}
