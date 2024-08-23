
export function delay() {
    setTimeout(() => {
    }, 500);
}

// 랜덤값을 산출하는 함수
export async function getDamageMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 치명여부를 산출하는 함수
export async function getIsCritical(criticalChance) {
    const RandomSeed = Math.random() * 100;
    RandomSeed <= criticalChance ? true : false;
}

export async function getCriticalDamage(criticalRatio, maxDamage) {
    return Math.floor(maxDamage + (maxDamage * criticalRatio));
}


// 회피여부를 산출하는 함수


// 디버프 적중 여부를 산출하는 함수

