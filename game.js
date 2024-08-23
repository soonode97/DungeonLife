import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Unit {
  constructor(name, hp, minDamage, maxDamage, type, speed) {
    this.name = name;
    this.hp = hp;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.unitType = type;
    this.speed = speed;
    this.isRun = false;   // 도망갔는지 확인하는 불리언
  }

  hold(logs) {
    Battle.initBattleLogs(chalk.bgBlack(`[${logs.length}] ${this.name}이 가만히 있습니다.`), logs);
  }

  attack(target, logs) {
    const damage = Math.floor(Math.random() * this.minDamage + this.maxDamage);
    const attackMessage = `[${logs.length}] ${this.name}이 ${target.name}에게 ${damage}만큼 피해를 입혔습니다.`;
    target.hp -= damage;
    target.unitType !== 'user'
      ? Battle.initBattleLogs(chalk.bgGreen(attackMessage), logs)
      : Battle.initBattleLogs(chalk.bgRed(attackMessage), logs);
      Battle.initBattleLogs(chalk.bgBlack(`[${logs.length}] ${target.name}의 HP가 ${target.hp}만큼 남았습니다.`), logs);
  }
}

class Player extends Unit {
  constructor() {
    super('Violeto', 100, 10, 10, 'user', 80);
    this.escapeChanceRatio = 20;
  }

  // 도망치기
  escape(logs) {
    const isEscape = Math.floor(Math.random() * 100);
    if (isEscape > this.escapeChanceRatio) {
      Battle.initBattleLogs(chalk.bgGreen(`[${logs.length}] ${this.name}이 도망치지 못했습니다!!`), logs);
      logs.push();
      return false;
    }
    Battle.initBattleLogs(chalk.bgGreen(`[${logs.length}] ${this.name}이 도망에 성공했습니다!!`), logs);
    return true;
  }

  heal(stage = 0, skillRatio = 0, logs) {
    const healAmount = Math.floor(Math.random() * 10 + 10) * (1 + stage * 0.5 + skillRatio * 0.05);
    if (stage !== 0) {
      console.log(
        chalk.bgYellow(`${this.name}이 스테이지를 클리어하여 ${healAmount}만큼 HP를 회복했습니다.`),
      );
    } else if (skillRatio !== 0) {
      Battle.initBattleLogs(chalk.bgYellow(`[${logs.length}] ${this.name}이 스킬로 인해 ${healAmount}만큼 HP를 회복했습니다.`), logs);
    }
    this.hp += healAmount;
  }

  async action(player, monster, logs) {
    console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다. 3. 도망 간다`));
    const choice = readlineSync.question('당신의 선택은? '); 

    // 플레이어의 선택에 따라 다음 행동 처리
    Battle.initBattleLogs(chalk.green(`[${logs.length}] ${choice}를 선택하셨습니다.`), logs);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (choice) {
          case '1':
            player.attack(monster, logs);
            break;
          case '2':
            player.hold(logs);
            break;
          case '3':
            if (player.escape(logs) === true) {
              player.isRun = true;
            }
            break;
        }

        resolve();
      }, 500);
    });
  }
}

class Monster extends Unit {
  constructor() {
    super('Goblin', 50, 5, 10, 'enemy', 90);
  }

  async action(player, monster, logs) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.hp > 0) {
          this.attack(player, logs);
        }
        resolve();
      }, 500);
    })
  }
}

// 스테이지에 관련된 속성과 메서드가 있는 클래스
class Stage {
  constructor(player, stageLength) {
    this.player = player;
    this.totalStage = stageLength;
    this.currentStage = 1;
    this.battleLogs = [];
    this.turn = [];
  }

  // 스테이지의 상황을 
  displayStageInfo(player, monster, turn) {
    let turnMessage = '[턴 순서] ';
    turn.forEach((turn, i) => {
      turnMessage += `| ${i + 1} 순위 : ${turn.name} `;
    });
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
      chalk.cyanBright(`| Stage: ${this.currentStage} `) +
        chalk.blueBright(
          `| Player HP: ${player.hp} Attak: ${player.minDamage}~${player.minDamage + player.maxDamage} | `,
        ) +
        chalk.redBright(
          `| Monster HP: ${monster.hp} Attak: ${monster.minDamage}~${monster.minDamage + player.maxDamage} \n`,
        ) +
        chalk.yellow(`\n${turnMessage}`),
    );
    console.log(chalk.magentaBright(`=====================\n`));
  }

  async startStage(player, monster) {
    console.clear();
    this.battleLogs=[];
    console.log(chalk.magentaBright(`=== Stage ${this.currentStage} ===`));
    console.log(chalk.inverse(`\n${monster.name}을 조우했다!`));
    while (player.hp > 0 || monster.hp > 0) {
      console.clear();
      const turnOrder = Battle.checkTurn(player, monster);
      this.displayStageInfo(player, monster, turnOrder);
      await Battle.displyBattleLogs(this.battleLogs);
      
      const battleEnd = await Battle.battleStart(player, monster, turnOrder, this.battleLogs);
      if(battleEnd) {
        break;
      }
    }
  }

  checkStage(player, monster) {
    // 스테이지의 상황을 체크하는 시퀀스입니다.
    // 몬스터 처치 / 패배 / 클리어 => 3가지로 나뉩니다.
    if (monster.hp <= 0) {
      console.log(chalk.bgGreen(`[${++this.battleLogs.length}] ${monster.name}이 쓰러졌습니다.`));
      player.heal(this.currentStage, 0, this.battleLogs);
      const next = readlineSync.question('\n다음 스테이지로 넘어가려면 아무키나 입력하십시오.');
      this.logs = [];
      return true;
    }

    if (player.isRun === true) {
      const next = readlineSync.question('\n다음 스테이지로 넘어가려면 아무키나 입력하십시오.');
      this.logs = [];
      player.isRun = false;
      return true;
    }

    // 게임 종료 - 패배 시퀀스
    if (player.hp <= 0) {
      console.log(chalk.bgRed(`\n${player.name} 이 쓰러졌습니다.`));
      console.log(chalk.redBright(`\n=== Game Over ===`));
      const close = readlineSync.question('\n패배하였습니다. 다시 도전하세요!.\n');
      return false;
    }

    // 게임 종료 - 스테이지 클리어 시퀀스
    if (this.currentStage >= 10) {
      console.log(chalk.greenBright(`\n=== 게임 승리 ===`));
      const close = readlineSync.question('\n축하합니다!, 당신은 승리했습니다!\n');
      return false;
    }
  }
}

// 배틀에 관련된 메서드들을 정리한 클래스
class Battle {

  static async displyBattleLogs(logs) {
    logs.forEach(log => {
      console.log(log);
    })
  }

  // message를 넣어주면 자동으로 배틀로그에 넣어주고 출력해주는 함수
  static initBattleLogs(message, logs) {
    logs.push(message);
    console.log(message);
  }

  // 배틀을 시작하는 정적메서드
  // 이 안에서 턴을 정리하고 배틀 인풋을 수행하게 된다.
  static async battleStart(player, monster, turnOrder, logs) {
    // 턴 순서에 따라서 행동을 처리하도록 한다.
    for(let i=0; i<turnOrder.length; i++) {
      await turnOrder[i].action(player, monster, logs);

      const isBattleEnd = await Battle.endCheck(player, monster);
      if(isBattleEnd === true) {
        return true;
      }
    }
  }

  // 배틀의 상황을 체크하는 정적메서드
  // 이 안에서 배틀이 종료될 때마다 각종 상황을 체크해준다.
  static async endCheck(player, monster) {
    // 몬스터 혹은 유저의 체력이 0인지 확인하는 구역입니다
    if(player.hp <= 0 || monster.hp <=0) {
      return true;
    }
    else if (player.isRun === true) {
      return true;
    }
    return false;
  }

  //배틀 턴을 확인하고 관리하는 정적메서드
  static checkTurn(player, monster) {
    const unit = [player, monster];
    // 플레이어와 몬스터의 속도를 비교하여 더 빠른 객체가 먼저 턴을 가지도록 하고 배열형식으로 반환한다.
    const turn = unit.sort((p, m) => m.speed - p.speed);
    return turn;
  }
}

export async function startGame() {
  console.clear();
  const player = new Player();
  const stage = new Stage(player, 10);

  while (stage.currentStage <= stage.totalStage) {
    console.clear();
    const monster = new Monster();
    await stage.startStage(player, monster);
    const result = stage.checkStage(player, monster);
    
    if (result === false) {
      break;
    }
    else if (result === true) {
      stage.currentStage++;
    }
  }
}
