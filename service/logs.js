import readlineSync from 'readline-sync';
import chalk from 'chalk';

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
      chalk.blueBright(`| Player HP: ${player.hp} | Evasion : ${player.evasion}% | Nabi : ${player.passive[0].currentStack}\n\n`) +
      chalk.redBright(`| Monster HP: ${monster.hp} | Evasion : ${monster.evasion}% |\n`) +
      chalk.yellow(`\n${turnMessage}\n`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

// 공격 관련 상황을 출력해주는 함수
export function attackMessage(attacker, target, logs, damage, attackName) {
  initLogs(chalk.bgBlack(`[${logs.length}] ${attacker.name}이 ${attackName}를 시전합니다.`), logs);
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

// 선택 가능한 액션을 출력해주는 함수
export function possibleActionMessage(actions) {
  let actionMessage = '';
  for (let i = 0; i < actions.length; i++) {
    actionMessage += `${i + 1}.${actions[i].name} `;
  }
  console.log(`\n ${actionMessage}`);
}

// 선택한 액션을 배틀로그에 삽입해주는 함수
export function chooseAction(logs) {
  const choice = readlineSync.question('당신의 선택은? ');
  initLogs(chalk.green(`[${logs.length}] ${choice}를 선택하셨습니다.`), logs);
  return choice;
}

// 턴이 다음으로 넘어갈 때 출력해주는 함수
export function nextTurn() {}

// 스테이지가 넘어갈 때 출력해주는 함수
export function nextStageMessage_clear(name, logs) {
  console.log(chalk.bgGreen(`[${++logs.length}] ${name}이 쓰러졌습니다.`));
  const next = readlineSync.question('\n다음 스테이지로 넘어가려면 아무키나 입력하십시오.');
}

export function nextStageMessage_run() {
  const next = readlineSync.question('\n다음 스테이지로 넘어가려면 아무키나 입력하십시오.');
}

export function gameOverMessage(player) {
  console.log(chalk.bgRed(`\n${player.name} 이 쓰러졌습니다.`));
  console.log(chalk.redBright(`\n=== Game Over ===`));
  const close = readlineSync.question('\n패배하였습니다. 다시 도전하세요!.\n');
}

export function gameClearMessage() {
  console.log(chalk.greenBright(`\n=== 게임 승리 ===`));
  const close = readlineSync.question('\n축하합니다!, 당신은 승리했습니다!\n');
}