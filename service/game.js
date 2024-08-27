import { Player, Monster} from './unit.js';
import { Stage } from './Stage.js';
import { gameClearMessage } from './logs.js';

export async function startGame() {
  console.clear();
  const player = new Player();
  const stage = new Stage(3);

  while (stage.currentStage <= stage.totalStage) {
    console.clear();
    const monster = Monster.createMonster(stage);
    await stage.startStage(player, monster);
    const result = await stage.checkStage(player, monster);

    if (result === false) {
      break;
    } else if (result === true) {
      stage.currentStage++;
    }
  }
  if(stage.currentStage >= stage.totalStage) {
    console.clear();
    gameClearMessage();
  }
}
