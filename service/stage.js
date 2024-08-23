import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Battle } from './Battle.js';
import {
  clearHealMessage,
  displyBattleLogs,
  displayStageInfo,
  nextStageMessage_clear,
  nextStageMessage_run,
  gameClearMessage,
  gameOverMessage,
} from './logs.js';
import { start } from '../server.js';

// 스테이지에 관련된 속성과 메서드가 있는 클래스
export class Stage {
  constructor(player, stageLength) {
    this.player = player;
    this.totalStage = stageLength;
    this.currentStage = 1;
    this.battleLogs = [];
  }

  async startStage(player, monster) {
    console.clear();
    this.battleLogs = [];
    while (player.hp > 0 || monster.hp > 0) {
      const turnOrder = await Battle.checkTurn(player, monster);
      displayStageInfo(player, monster, this.currentStage, turnOrder);
      displyBattleLogs(this.battleLogs);

      const battleEnd = await Battle.battleStart(player, monster, turnOrder, this.battleLogs);
      if (battleEnd) {
        break;
      }
    }
  }

    // 스테이지의 상황을 체크하는 함수입니다.
  async checkStage(player, monster) {
    // 스테이지 종료 - 몬스터 사망
    if (monster.hp <= 0) {
      nextStageMessage_clear(monster.name, this.battleLogs);
      const heal = player.stageClearHeal(this.currentStage, 0, this.battleLogs);
      clearHealMessage(player.name, heal);
      this.logs = [];
      return true;
    }

    // 스테이지 종료 - 플레이어 도주
    if (player.isRun === true) {
      nextStageMessage_run();
      this.logs = [];
      player.isRun = false;
      return true;
    }

    // 게임 종료 - 패배 시퀀스
    if (player.hp <= 0) {
      gameOverMessage(player);
      start();
      return false;
    }

    // 게임 종료 - 스테이지 클리어 시퀀스
    if (this.currentStage >= 10) {
      gameClearMessage();
      return false;
    }
  }
}
