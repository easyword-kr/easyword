export const metadata = {
  title: "쉬운 번역팁 | 쉬운 전문용어",
  description: "쉬운 전문용어 프로젝트의 번역 팁을 소개합니다.",
};

export default function TipsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">원칙</h1>
        <ul className="list-disc pl-6 leading-7">
          <li>
            <strong>정확히 이해하기</strong>: 전문용어의 의미를 정확히
            이해하도록 한다. 이해못했다면 쉬운말을 찾을 수 없다.
          </li>
          <li>
            <strong>쉬운말을 찾기</strong>: 그 의미가 정확히 전달되는 쉬운말을
            찾는다.
          </li>
          <li>
            <strong>어깨힘 빼기</strong>: 이때, 어깨에 힘을 뺀다. 지레
            겁먹게하는 용어(불필요한 한문투)를 피하고, 가능하면 쉬운말을 찾는다.
          </li>
          <li>
            <strong>하나만일 필요는 없다</strong>: 전문용어 하나에 쉬운 한글용어
            하나가 일대일 대응일 필요가 없이, 상황에 따라서 다양하게 풀어쓸 수
            있다. 중요한 것은 의미의 명확한 전개.
          </li>
          <li>
            <strong>때로는 소리나는 대로</strong>: 도저히 쉬운말을 찾을 수 없을
            땐, 소리나는대로 쓴다.
          </li>
          <li>
            <strong>때로는 만들기</strong>: 쉬운 느낌을 가진 새 말을 만들 수도
            있다. 우리가 모국어의 심연을 공유하므로 가능하다.
          </li>
          <li>
            <strong>괄호안에 항상-I</strong>: 원문 전문용어는 괄호안에 항상
            따라붙인다.
          </li>
          <li>
            <strong>깨어있기</strong>: 기존의 관성에 눈멀지 않는다. 이미
            널리퍼진 용어지만 쉽지않다면, 보다 쉬운 전문용어를 찾고 실험한다.
          </li>
          <li>
            <strong>괄호안에 항상-II</strong>: 이때, 기존용어는 원문 전문용어와
            함께 괄호안에 따라붙인다.
          </li>
          <li>
            <strong>순우리말 No, 쉬운말 Yes</strong>: 쉬운말은 순수 우리말을
            뜻하지 않는다. 외래어라도 널리 쉽게 받아들여진다면 사용한다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">쉬운 번역팁</h1>
        <ul className="list-disc pl-6 leading-7">
          <li>
            <strong>non-XX</strong>: {"'비XX'"} 대신에 간혹 {"'XX 외'"}가 좋을
            때도 있음 (예: non-functional NN ⇒ 비기능NN (X), 기능외NN (O))
          </li>
          <li>
            <strong>engineering</strong>: 학문으로서 공학이 아니라면 분석, 파악,
            방법 (예: reverse engineering ⇒ 거꾸로 분석하기)
          </li>
          <li>
            <strong>integrated</strong>: 통합도 괜찮지만 가끔 종합이 어울릴 때도
            (예: IDE ⇒ 종합개발환경, {"'종합선물세트'"}에서)
          </li>
          <li>
            <strong>XX-guided-YY</strong>: XX로 배우는 YY (예:
            counter-example-guided ⇒ 반례로 배우는 …)
          </li>
          <li>
            <strong>logic</strong>: 논리가 아니라 절차를 이야기할 때도 있음 (예:
            business logic ⇒ 업무처리절차)
          </li>
          <li>
            말을 만들수도 있음 (예: iff ⇒ 이면이, FIFO/LIFO ⇒ 먼저먼저/나중먼저,
            coverage ⇒ 덮이 ({"'깊이'"}, {"'넓이'"} 같이))
          </li>
          <li>
            우리말에 풍부한 의성/의태어를 활용할 수 있음 (예: curried function ⇒
            야금야금 함수)
          </li>
          <li>전문용어는 띄어쓰기 안해도 좋음 (국립국어원)</li>
        </ul>
      </section>
    </div>
  );
}
