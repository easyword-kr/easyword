import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import YouTube from "@/components/icons/you-tube";

export const metadata = {
  title: "배경 | 쉬운 전문용어",
  description: "쉬운 전문용어 프로젝트의 배경, 원칙, 쓰임에 대해 소개합니다.",
};

export default function BackgroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">쉬운 전문용어</h1>
      </header>
      <div className="text-right text-sm">
        <Link
          href="https://kwangkeunyi.snu.ac.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground underline underline-offset-4"
        >
          한국정보과학회 쉬운전문용어 제정위원회
          <br />
          서울대학교 컴퓨터공학부 이광근
        </Link>
      </div>

      <Separator />

      <div className="pt-2">
        <p className="text-lg font-extrabold">
          억지 순우리말? <span className="text-red-600">No.</span> 소리뿐인
          한문투?
          <span className="text-red-600"> No. </span>쉬운말?
          <span className="text-blue-600"> Yes! </span>
          <span className="text-blue-600">
            <Link href="https://drive.google.com/file/d/1FfgO2lupwUxWp8uRSRBtymQXmJxsX1VA/view?usp=drive_link">
            [두 개의 터널]</Link> </span>
        </p>
      </div>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">배경</h2>
        <ul className="list-disc pl-6 leading-7">
          <li>
            <p className="text-foreground leading-7">
              전문지식이 전문가들에게만 머물면 그 분야는 쇠퇴할 수
              있다. 저변이 좁아지고 깊은 공부를 달성하는 인구는 그만큼 쪼그라들
              수 있기때문이다.
            </p>
            <p className="text-foreground leading-7">
              전문지식이 보다 많은 사람들에게 널리 퍼진다면, 그래서 더 발전할
              힘이 많이 모이는 활기찬 선순환이 만들어진다면. 그러면 그 분야를
              밀어올리는 힘은 나날이 커질 수 있다. 더 많은 사람들이 더 나은
              성과를 위한 문제제기와 답안제안에 참여할 수 있고, 전문가의 성과는
              더 널리 이해되고 더 점검받을 수 있게된다.
            </p>
          </li>
          <li>
            <p className="text-foreground leading-7">
              영어가 학술장벽을 뚫는 첫 번째 터널이라면, 두 번째 터널은 우리말
              쉬운 전문용어다. 전문개념을 영어 용어로만 넘기지않고 우리말의
              직관으로 흠뻑 빨아들일 때, 전문가는 두 언어권의 어휘력을 양날개
              삼아 공부의 깊이를 수월하게 이룬다.
            </p>
            <p className="text-foreground leading-7">
              그래서 우리말 쉬운전문용어는 저변 인구를 넓혀주는 효과만이 아니다.
              모국어의 심연을 활용하여 전문가 각자의 연구력을 글로벌 탑으로 보다
              쉽게 올려주는 비밀병기다. 아직 드러나지 않은, 하지만 진실인 비밀.
              그 곳에 깃발을 세우는 학술문화 벤처다.
            </p>
          </li>
          <li>
            <p className="text-foreground leading-7">
              그러므로 쉬운 전문용어가 어떨까. 전문개념의 핵심을 쉽게 전달해주는
              전문용어. 학술은 학술의 언어를—우리로서는 소리로만 읽을 원어나
              한문을—사용해야만 정확하고 정밀하고 경제적일까? 아무리 정교한
              전문지식이라도 쉬운 일상어로 짧고 정밀하게 전달될 수 있다. 시에서
              평범한 언어로 밀도 있게 전달되는 정밀한 느낌을 겪으며 짐작되는
              바이다.
            </p>
            <p className="text-foreground leading-7">
              쉬운 전문용어가 활발히 만들어지고 테스트되는 생태계. 이것이
              울타리없는 세계경쟁에서 우리를 깊고 높게 키워줄 비옥한 토양이다.
              시끌벅적 쉬운말로 하는 학술의 재미는 말할것도 없다.
            </p>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">원칙</h2>
        <p className="text-foreground leading-7">
          쉬운 전문용어를 만들때 원칙은 다음과 같다.
        </p>
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
        <h2 className="text-2xl font-semibold">쓰임</h2>
        <p className="text-foreground leading-7">
          한국어 언어권에서 말하고 글 쓸 때 사용한다.
        </p>
        <ul className="list-disc pl-6 leading-7">
          <li>
            설명/강의/저술/번역/블로그/SNS 등에서 한국어로 말하고 글 쓸 때
            사용한다.
          </li>
          <li>
            쉽게쉽게 도란도란, 통쾌하게 시끌벅적, 차근차근 왁자글, 신나게
            재미있게.
          </li>
        </ul>
      </section>
    </div>
  );
}
