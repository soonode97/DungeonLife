import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { delay } from './utils.js';

// 배틀로그에 로그를 삽입하는 함수
function initLogs(message, logs) {
  logs.push(message);
  console.log(message);
}

// 배틀로그에 담긴 로그들을 모두 출력해주는 함수
export function displyBattleLogs(logs) {
  logs.forEach((log) => {
    console.log(log);
  });
}

// 현재 스테이지의 상황을 출력해주는 함수
export function displayStageInfo(player, monster, currentStage, turn) {
  console.clear();
  let turnMessage = '[턴 순서] ';
  turn.forEach((turn, i) => {
    turnMessage += `| ${i + 1} 순위 : ${turn.name} `;
  });
  console.log(chalk.magentaBright(`\n=== Stage Status ===\n`));
  console.log(
    chalk.inverse(`${monster.name} 을 조우했다\n`) +
      chalk.cyanBright(`\n| Stage: ${currentStage} |\n\n`) +
      chalk.blueBright(
        `| Player HP: ${player.hp} | Evasion : ${player.evasion}% | ${player.actionTypes[0].name} : ${player.actionTypes[0].minDamage}~${player.actionTypes[0].maxDamage} | ${player.actionTypes[1].name} : ${player.actionTypes[1].minDamage}~${player.actionTypes[1].maxDamage} |\n\n`,
      ) +
      chalk.redBright(
        `| Monster HP: ${monster.hp} | Evasion : ${monster.evasion}% | ${monster.actionTypes[0].name} : ${monster.actionTypes[0].minDamage}~${monster.actionTypes[0].maxDamage} | ${monster.actionTypes[1].name} : ${monster.actionTypes[1].minDamage}~${monster.actionTypes[1].maxDamage} |\n`,
      ) +
      chalk.yellow(`\n${turnMessage}\n`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

// 공격 관련 상황을 출력해주는 함수
export function attackMessage(attacker, target, logs, damage, attackName, isCritical, isEvasion) {
  initLogs(chalk.bgBlack(`[${logs.length}] ${attacker.name}이 ${attackName}를 시전합니다.`), logs);

  if (isEvasion) {
    initLogs(chalk.yellow(`[${logs.length}] ${target.name}이 공격을 회피하였습니다!!`), logs);
  }

  if (isCritical) {
    initLogs(chalk.underline(`[${logs.length}] 공격이 크리티컬로 들어갑니다!!`), logs);
  }

  const attackMessage = `[${logs.length}] ${attacker.name}이 ${target.name}에게 ${damage}만큼 피해를 입혔습니다.`;
  attacker.unitType === 'user'
    ? initLogs(chalk.bgGreen(attackMessage), logs)
    : initLogs(chalk.bgRed(attackMessage), logs);

  initLogs(
    chalk.bgBlack(`[${logs.length}] ${target.name}의 HP가 ${target.hp}만큼 남았습니다.`),
    logs,
  );
}

// 도망 상황을 출력해주는 함수
export function runMessage(isRun, name, logs) {
  if (isRun !== true) {
    initLogs(chalk.bgGreen(`[${logs.length}] ${name}이 도망치지 못했습니다!!`), logs);
  } else {
    initLogs(chalk.bgGreen(`[${logs.length}] ${name}이 도망에 성공했습니다!!`), logs);
  }
}

// 스테이지 클리어 후 회복상황을 출력해주는 함수
export function clearHealMessage(name, healAmount) {
  console.log(
    chalk.bgYellow(`${name}이 스테이지를 클리어하여 ${healAmount}만큼 HP를 회복했습니다.`),
  );
}

// 스킬 사용 후 피 회복을 출력해주는 함수
export function skillHealMessage(name, healAmount, logs) {
  console.log(
    initLogs(chalk.bgYellow(`${name}이 나비 가르기를 클리어하여 ${healAmount}만큼 HP를 회복했습니다.`), logs),
  );
}

// 선택 가능한 액션을 출력해주는 함수
export function possibleActionMessage(actions) {
  let actionMessage = '';
  for (let i = 0; i < actions.length; i++) {
    actionMessage += `${i + 1}.${actions[i].name} `;
  }
  console.log(`\n ${actionMessage}`);
}

// 선택한 액션을 배틀로그에 삽입해주는 함수
export async function chooseAction(actions, logs) {
  let choice = null;
  // const choice = readlineSync.question('당신의 선택은? ');
  // initLogs(chalk.green(`[${logs.length}] ${choice}를 선택하셨습니다.`), logs);

  while(choice === null) {
    choice = readlineSync.questionInt('당신의 선택은? ');
    initLogs(chalk.green(`[${logs.length}] ${choice}를 선택하셨습니다.`), logs);

    if(choice > actions.length || choice <= 0) {
      console.log('선택지에 없는 행동입니다. 다시 선택해주세요.');
      choice = null;
    }
  }

  return new Promise (resolve => {
    resolve(choice);
  });
}

// 턴이 다음으로 넘어갈 때 출력해주는 함수
export function nextTurn(logs) {
  initLogs(chalk.bgWhite(`[${logs.length}] 다음 턴으로 넘어갑니다.`), logs);
}

// 스테이지가 넘어갈 때 출력해주는 함수
export function monsterDiedMessage(name, logs) {
  console.log(chalk.bgGreen(`[${++logs.length}] ${name}이 쓰러졌습니다.`));
}

// 도망으로 스테이지 넘어갈때 출력
export function nextStageMessage() {
  const next = readlineSync.question('\n다음 스테이지로 넘어가려면 아무키나 입력하십시오.');
  delay(2000);
}

//
export function gameOverMessage(player) {
  console.log(chalk.bgRed(`\n${player.name} 이 쓰러졌습니다.`));
  console.log(chalk.redBright(`\n=== Game Over ===`));
  const close = readlineSync.question('\n패배하였습니다. 다시 도전하세요!.\n');
}

export function gameClearMessage() {
  console.log(chalk.greenBright(`\n=== 게임 승리 ===`));
  const close = readlineSync.question('\n축하합니다!, 당신은 승리했습니다!\n');
}

export function errorPush(message, logs) {
  initLogs(message, logs);
}
