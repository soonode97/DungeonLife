import { Player, Monster} from './unit.js';
import { Stage } from './Stage.js';

export async function startGame() {
  console.clear();
  const player = new Player();
  const stage = new Stage(player, 10);

  while (stage.currentStage <= stage.totalStage) {
    console.clear();
    const monster = Monster.createMonster();
    await stage.startStage(player, monster);
    const result = await stage.checkStage(player, monster);

    if (result === false) {
      break;
    } else if (result === true) {
      stage.currentStage++;
    }
  }
}
