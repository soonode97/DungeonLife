export function delay(time) {
  setTimeout(() => {}, time);
}

// 최소부터 최대까지 랜덤으로 산출해주는 함수
export function getMinToMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 크리티컬 여부를 산출하는 함수
export function getIsCritical(criticalChance) {
  const RandomSeed = Math.random() * 100;
  return RandomSeed <= criticalChance ? true : false;
}

// 크리티컬 데미지를 산출하는 함수
export function getCriticalDamage(criticalRatio, maxDamage) {
  return Math.floor(maxDamage + maxDamage * criticalRatio);
}

// 회피여부를 산출하는 함수
export function getIsEvasion(evasionChance) {
  const RandomSeed = Math.random() * 100;
  return RandomSeed <= evasionChance ? true : false;
}

// 스테이지 클리어 회복량을 산출하는 함수
export function getStageClearHeal(stage) {
  const healAmount = Math.floor(Math.random() * 10 + stage * 10);
  return healAmount;
}

// 스테이지가 진행되기 전 데미지 증가
export function getStageBuffDamage(stage) {
  const buffAmount = (stage - 1) * Math.floor((Math.random() + 1) * 2);
  return buffAmount;
}

// 나비 가르기 피해량에 비례하여 회복량을 산출하는 함수
export function getSkillHeal(damage) {
  const healAmount = Math.floor(Math.random() * 10 + damage * 0.5);
  return healAmount;
}

// 스테이지마다 몬스터의 체력 증가량 산출하는 함수
export function getMonsterHpBuff(target, stage) {
  if(target.name === 'Goblin') {
    const buffAmount = Math.floor((stage-1)*(Math.random()*5+10));
    return buffAmount;
  }
  else if(target.name === 'Orc') {
    const buffAmount = Math.floor((stage-1)*(Math.random()*10+20));
    return buffAmount;
  }
  else if(target.name === 'Wolf') {
    const buffAmount = Math.floor((stage-1)*(Math.random()*10+15));
    return buffAmount;
  }
  else if(target.name === 'Dragon') {
    const buffAmount = Math.floor((stage-1)*(Math.random()*20+40));
    return buffAmount;
  }
}