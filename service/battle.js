import { delay } from './utils.js';
import { nextTurn } from './logs.js';

// 배틀에 관련된 메서드들을 정리한 클래스
export class Battle {
  // 배틀을 시작하는 정적메서드
  // 이 안에서 턴을 정리하고 배틀 인풋을 수행하게 된다.
  static async battleStart(player, monster, turnOrder, logs) {
    // 턴 순서에 따라서 행동을 처리하도록 한다.
    for (let i = 0; i < turnOrder.length; i++) {
    //   await logs.push(monster);
      await turnOrder[i].action(player, monster, logs);
      delay(2000);

      const isBattleEnd = await Battle.endCheck(player, monster);

      if (isBattleEnd === true) {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    }
  }

  // 배틀의 상황을 체크하는 정적메서드
  // 이 안에서 배틀이 종료될 때마다 각종 상황을 체크해준다.
  static async endCheck(player, monster) {
    // 몬스터 혹은 유저의 체력이 0인지 확인하는 구역입니다
    return new Promise(resolve => {
      if (player.hp <= 0 || monster.hp <= 0) {
        resolve(true);
      } else if (player.isRun === true) {
        resolve(true);
      }
      resolve(false);
    })
  }

  //배틀 턴을 확인하고 관리하는 정적메서드
  static checkTurn(player, monster) {
    const unit = [player, monster];
    // 플레이어와 몬스터의 속도를 비교하여 더 빠른 객체가 먼저 턴을 가지도록 하고 배열형식으로 반환한다.
    const turn = unit.sort((p, m) => m.speed - p.speed);
    return turn;
  }


// 행동 가능한 액션을 확인하는 메서드
  static async checkPossibleAction(target) {
    const possibleAction = await target.actionTypes.filter((action) => {
      if (action.currentCooltime <= 0) {
        return action;
      }
    });
    return possibleAction;
  }


  // 배틀이 종료된 이후 초기화 및 쿨타임 관련을 처리하는 메서드
  static async afterBattleEnd(player, monster, logs) {
    //player 관련 초기화
    player.isCritical = false;
    player.isEvasion = false;
    if(player.actionTypes[1].currentCooltime > 0) {
      player.actionTypes[1].currentCooltime--;
    }

    //monster 관련 초기화
    monster.isCritical = false;
    monster.isEvasion = false;
    if(monster.actionTypes[1].currentCooltime > 0) {
      monster.actionTypes[1].currentCooltime--;
    }

    return new Promise((resolve) => {
      resolve(nextTurn(logs));
    })
  }
}