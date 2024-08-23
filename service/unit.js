import { Battle } from './Battle.js';
import { attackMessage, runMessage, possibleActionMessage, chooseAction } from './logs.js';
import { getDamageMinToMax, getIsCritical, getCriticalDamage } from './utils.js';
import { delay } from './utils.js';

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
    this.buff = [];
    this.debuff = [];
  }

  async attack(attackType, target) {
    // 크리티컬인지 확인
    const isCritical = await getIsCritical(this.criticalChance);

    // 크리티컬상황
    // 크리티컬은 항상 maxDamage에서 치명타배율이 들어가는 것으로 함
    if (isCritical) {
      const damage = await getCriticalDamage(this.criticalRatio, attackType.maxDamage);
      target.hp -= damage;
      return damage;
    } else {
      const damage = await getDamageMinToMax(attackType.minDamage, attackType.maxDamage);
      target.hp -= damage;
      return damage;
    }
  }
}

export class Player extends Unit {
  constructor() {
    super('Violeto', 100, 60, 20, 20, 0.8, 'user');
    this.escapeChanceRatio = 20;
    this.passive = [
      {
        name: '나비',
        type: 'passive',
        maxStack: 5,
        currentStack: 0,
      },
    ];
    this.actionTypes = [
      {
        name: '우아한 베기',
        type: 'attack',
        minDamage: 10,
        maxDamage: 20,
        debuffType: 'decreaseAttack',
        debuffValue: 50,
        debuffDuration: 1,
        buffType: 'increaseEvasion',
        buffValue: 5,
        buffDuration: 1,
        cooltime: 0,
        currentCooltime: 0,
      },
      {
        name: '나비 가르기',
        type: 'attack',
        minDamage: 20,
        maxDamage: 30,
        buffType: 'heal',
        buffValue: 10,
        buffDuration: 0,
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
    const healAmount = Math.floor(Math.random() * 10 + 10) * (1 + stage * 0.5);
    this.hp += healAmount;
    return healAmount;
  }

  async action(player, monster, logs) {
    // 쿨타임인 행동을 제외하고 할 수 있는 행동을 정리한다.
    const actions = await Battle.checkPossibleAction(this);
    // 행동들을 출력한다.
    possibleActionMessage(actions);
    // 행동들을 선택한다.
    const choice = chooseAction(logs);

    // 플레이어의 선택에 따라 다음 행동 처리
    // 입력에 대한 행동을 키값으로 관리하는게 좋겠다고 판단
    if (actions[choice - 1].type === 'attack') {
      // 스킬을 사용한 경우
      if (actions[choice - 1] === this.actionTypes[1]) {
        // 스킬 쿨타임 적용
        this.actionTypes[1].currentCooltime = this.actionTypes[1].cooltime;
      }

      const damage = await this.attack(actions[choice - 1], monster);
      attackMessage(this, monster, logs, damage, actions[choice - 1].name);
    } else if (actions[choice - 1].type === 'run') {
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
        criticalChance: 10,
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
            debuffType: 'decreaseHit',
            debuffValue: 5,
            debuffDuration: 1,
          },
        ],
      },
      {
        name: 'Orc',
        hp: 80,
        speed: 30,
        evasion: 10,
        criticalChance: 20,
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
        criticalChance: 35,
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
            debuffType: 'decreaseAttack',
            debuffValue: 50,
            debuffDuration: 1,
            currentCooltime: 0,
          },
        ],
      },
      {
        name: 'Dragon',
        hp: 200,
        speed: 30,
        evasion: 20,
        criticalChance: 30,
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
            currentCooltime: 0,
            debuffType: 'decreaseAttack',
            debuffValue: 50,
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

      // 몬스터의 특수 공격이 쿨타임인지 확인하고,
      // 쿨타임이 아닌 경우 반반확률로 특수 공격을 사용하도록 설정
      // 특수 공격이 아닌 경우는 일반 공격을 하도록 설정
      let attackIs = {};
      if (actions[1] !== undefined) {
        const isSpecialAttack = Math.floor(Math.random() * 100);
        if (isSpecialAttack > 40) {
          attackIs = await Object.assign(attackIs, actions[1]);
          this.actionTypes[1].currentCooltime = this.actionTypes[1].cooltime;
        }
      }

      // 일반 공격
      else if (actions[1] === undefined) {
        attackIs = await Object.assign(attackIs, actions[1]);
        await Object.assign(attackIs, actions[0]);
        this.actionTypes[1].currentCooltime--;
      }

      // 공격 시작
      const damage = await this.attack(attackIs, player);
      attackMessage(monster, player, logs, damage, attackIs.name);
    }
  }
}
