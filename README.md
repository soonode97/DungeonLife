# DungeonLife
 챕터2 개인 프로젝트

---

## 소개

DungeonLife는 비올레토라는 주인공이 던전에서 다양한 적들을 처치하는 게임입니다.

운영 방식은 단순하게 게임을 시작하면 던전에 바로 입장이 되고, 적을 조우하게 됩니다.

적을 조우하고 선택지를 골라서 적과 전투를 한 뒤 스테이지를 진행 및 종료하며 나아갑니다.

<img src="https://github.com/user-attachments/assets/f2dcbf5d-2609-49df-8d8d-654ddbd0fecc" style="width:500px"/>

---

## 주요 기능
### 1. 캐릭터와 몬스터 스킬 구현
기본적으로 일반적인 공격과 스킬 공격이 있으며, 스킬 공격은 쿨타임이 존재하고 일반 공격보다 조금 더 쎕니다.

버프와 디버프를 주고 싶었지만 시간이 부족할 것 같아 넣지 못했습니다.

<img src="https://github.com/user-attachments/assets/f58bb0a6-31d2-4426-b566-173ecc65c806" style="width:500px"/>

작동 방식은 

1-1. 스킬 쿨타임 상황이 아니라면 행동이 가능한 것으로 처리됩니다.

1-2. 몬스터는 공격을 할 때 스킬 행동이 가능한 상황인 경우 40% 확률로 스킬을 사용하도록 설정했습니다.

1-3. 플레이어는 스킬 행동이 가능한 상황인 경우 선택지에 노출되며 사용이 가능합니다.


### 2. 다양한 몬스터 구현

몬스터는 총 4가지로 각 출현 확률에 따라 일정확률로 조우하게 됩니다.

Goblin, Orc, Wolf, Dragon 이 있으며 Dragon은 죽음의 수준입니다.

작동 방식은

2-1. 몬스터 클래스에 몬스터를 생성하는 메서드를 만들었습니다.

2-2. 해당 메서드가 호출이되면 미리 지정한 몬스터의 스테이터스가 담긴 몬스터타입이 선언됩니다.

2-3. 몬스터 종류만큼 반복문을 돌며 몬스터타입 스테이터스 중 출현 확률에 따라 출현을 결정합니다.

     ex) 고블린 실패 > 오크 실패 -> 늑대 성공 ======> 늑대 출현

<img src="https://github.com/user-attachments/assets/07182800-dfef-4434-a628-5801abf3f411"/>

<img src="https://github.com/user-attachments/assets/e408eefa-b55c-4ada-a68b-6adeb907167c"/>

### 3. 스피드에 기반한 턴제 방식

플레이어와 적의 스피드를 확인하여 이번 턴의 행동 순서를 잡게 됩니다.

턴 순서를 스테이지 현황에 같이 노출시켜줬습니다.

<img src="https://github.com/user-attachments/assets/d8edffe5-1115-448c-a0ee-83a950c13db2"/>

---

## 기본 기능

### 1. 공격하기

플레이어 혹은 몬스터가 공격하는 로직과 피격하는 기능을 구현했습니다.

공격을 하게되면 객체의 actionTypes에 minDamage 와 maxDamage 를 Random으로 산출하여 피해를 주게됩니다.

### 2. 도망치기

도망치기는 플레이어만 가능하며 도망칠 수 있는 확률로 도망 성공 여부를 판단합니다.

도망에 성공하면 스테이지를 넘어가게 되고, 도망으로 스테이지를 넘어가게 되면 피 회복을 받지 못합니다.

<img src="https://github.com/user-attachments/assets/4b805de7-2121-4e9f-8f80-81d7b8d63bf6"/>

### 3. 스테이지 진행에 비례하여 스탯 증가

3-1. 체력

플레이어의 경우 몬스터 처치로 스테이지 클리어 시, 체력이 일정량 회복이 됩니다.

<img src="https://github.com/user-attachments/assets/edb75ee1-7c51-480f-a390-a8eb843279ff"/>

몬스터의 경우 스테이지에 비례하여 추가 체력을 얻은 상태로 조우하게 됩니다. (하단 전체사진 참고)

3-2. 데미지

플레이어와 몬스터 모두 스테이지에 비례하여 minDamage, maxDamage가 상승합니다.

<img src="https://github.com/user-attachments/assets/e58bb473-0db5-4c44-85c6-04835772ac40" style="width:300px"/>
<img src="https://github.com/user-attachments/assets/ae275f9d-f0ce-41b8-975b-4626d23787fb" style="width:300px"/>

### 4. 게임 승리 및 게임 패배

4-1. 게임 승리

스테이지가 총 스테이지를 넘어서는 경우 게임을 즉시 종료하고 게임 승리를 띄웁니다.

<img src="https://github.com/user-attachments/assets/d76f98b9-78f9-4be4-956d-dfa47649c99c"/>

4-2. 게임 패배

플레이어의 체력이 0 이하가 되는 경우 게임을 즉시 종료하고 게임 패배를 띄웁니다.

게임 패배하면 다시 메인메뉴로 이동하도록 구현되었습니다.

<img src="https://github.com/user-attachments/assets/9a2e8ab8-3fdc-4cb7-afbe-69dc90e08337"/>
