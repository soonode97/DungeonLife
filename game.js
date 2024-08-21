import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Unit {
  constructor(name, hp, minDamage, maxDamage, type) {
    this.name= name;
    this.hp = hp;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.unitType = type;
  }

  hold(logs) {
    logs.push(chalk.bgBlack(`[${logs.length}] ${this.name}이 가만히 있습니다.`));
  }

  attack(target, logs) {
    const damage = Math.floor((Math.random() * this.minDamage)+this.maxDamage);
    const attackMessage = `[${logs.length}] ${this.name}이 ${target.name}에게 ${damage}만큼 피해를 입혔습니다.`;
    target.hp -= damage;
    target.unitType!=='user' ? logs.push(chalk.bgGreen(attackMessage)) : logs.push(chalk.bgRed(attackMessage));
    logs.push(chalk.bgBlack(`[${logs.length}] ${target.name}의 HP가 ${target.hp}만큼 남았습니다.`));
  }
}

class Player extends Unit{
  constructor() {
    super('Violeto', 100, 10, 10, 'user');
  }
}

class Monster extends Unit{
  constructor() {
    super('Goblin', 100, 5, 10, 'enemy');
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| Player HP: ${player.hp} Attak: ${player.minDamage}~${player.minDamage+player.maxDamage} | `,
    ) +
    chalk.redBright(
      `| Monster HP: ${monster.hp} Attak: ${monster.minDamage}~${monster.minDamage+player.maxDamage} `,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let logSize = `[${logs.length+1}]`;

  while(player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 아무것도 하지않는다.`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${logSize} ${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':
        player.attack(monster, logs);
        break;
      case '2':
        player.hold(logs);
        break;
    }

    // 몬스터의 행동
    if(monster.hp > 0) {
      monster.attack(player, logs);
    }
    else {
      logs.push(chalk.bgGreen(`${logSize} ${monster.name}이 쓰러졌습니다.`));
      const next = readlineSync.question('다음 스테이지로 넘어가려면 아무키나 입력하십시오.');
      break;
    }
  }

  return new Promise((resolve) => {

  })
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster();
    await battle(stage, player, monster);

    // 패배 시퀀스
    if(player.hp <= 0) {
      console.log(chalk.bgRed(`\n${player.name} 이 쓰러졌습니다.`));
      console.log(chalk.redBright(`\n=== Game Over ===`));
      console.log(chalk.redBright(`패배하였습니다. 다시 도전하세요!`));
      break;
    }

    // 스테이지 클리어 및 게임 종료 조건
    stage++;
    if(stage >= 10) {
      console.log(chalk.greenBright(`\n=== 게임 승리 ===`));
      console.log(chalk.greenBright(`축하합니다!, 당신은 승리했습니다!`));
      break;
    }
  }
}