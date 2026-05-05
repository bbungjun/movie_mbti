'use client';

interface TasteResultCharacterProps {
  code: string;
  className?: string;
}

// 각 타입별 특성을 반영한 캐릭터 SVG
const CHARACTER_SVG: Record<string, React.ReactNode> = {
  // DCP - 도파민 중독자: 번개와 폭발적인 에너지
  DCP: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 배경 원 */}
      <circle cx="60" cy="60" r="55" fill="url(#dcp-bg)" opacity="0.2" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#dcp-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 열정적인 표정 */}
      <ellipse cx="50" cy="50" rx="5" ry="6" fill="#1a1a1a" />
      <ellipse cx="70" cy="50" rx="5" ry="6" fill="#1a1a1a" />
      <circle cx="52" cy="48" r="2" fill="#fff" />
      <circle cx="72" cy="48" r="2" fill="#fff" />
      {/* 입 - 흥분된 미소 */}
      <path d="M50 62 Q60 72 70 62" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* 번개 머리카락 */}
      <path d="M35 35 L45 15 L50 30 L60 5 L65 28 L75 10 L80 32 L90 20 L85 40"
        fill="url(#dcp-hair)" />
      {/* 에너지 이펙트 */}
      <path d="M20 60 L30 55 L25 60 L35 58" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 60 L90 55 L95 60 L85 58" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      {/* 볼 터치 */}
      <circle cx="42" cy="58" r="4" fill="#FF6B6B" opacity="0.5" />
      <circle cx="78" cy="58" r="4" fill="#FF6B6B" opacity="0.5" />
      <defs>
        <linearGradient id="dcp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF4500" />
        </linearGradient>
        <linearGradient id="dcp-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E50914" />
          <stop offset="100%" stopColor="#B20710" />
        </linearGradient>
        <linearGradient id="dcp-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFF44F" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // DCR - 관계 스릴러 사냥꾼: 두 개의 연결된 에너지
  DCR: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#dcr-bg)" opacity="0.2" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#dcr-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 예리한 시선 */}
      <path d="M45 48 L55 52 L45 52 Z" fill="#1a1a1a" />
      <path d="M75 48 L65 52 L75 52 Z" fill="#1a1a1a" />
      <circle cx="50" cy="50" r="1.5" fill="#fff" />
      <circle cx="70" cy="50" r="1.5" fill="#fff" />
      {/* 입 - 살짝 올라간 미소 */}
      <path d="M52 60 Q60 65 68 60" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* 머리카락 - 안테나 느낌 */}
      <ellipse cx="60" cy="30" rx="22" ry="15" fill="url(#dcr-hair)" />
      <path d="M40 25 Q35 15 45 10" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M80 25 Q85 15 75 10" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* 연결 에너지 */}
      <circle cx="45" cy="8" r="4" fill="#EC4899" />
      <circle cx="75" cy="8" r="4" fill="#EC4899" />
      <path d="M49 8 Q60 0 71 8" stroke="url(#dcr-energy)" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="3 2" />
      {/* 볼 터치 */}
      <circle cx="42" cy="58" r="4" fill="#EC4899" opacity="0.4" />
      <circle cx="78" cy="58" r="4" fill="#EC4899" opacity="0.4" />
      <defs>
        <linearGradient id="dcr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="dcr-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="dcr-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#581C87" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
        <linearGradient id="dcr-energy" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // DEP - 서사 과몰입러: 전진하는 화살과 강한 의지
  DEP: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#dep-bg)" opacity="0.2" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#dep-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 결연한 표정 */}
      <ellipse cx="48" cy="50" rx="5" ry="5" fill="#1a1a1a" />
      <ellipse cx="72" cy="50" rx="5" ry="5" fill="#1a1a1a" />
      <circle cx="50" cy="48" r="2" fill="#fff" />
      <circle cx="74" cy="48" r="2" fill="#fff" />
      {/* 눈썹 - 집중 */}
      <path d="M42 42 L54 44" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M78 42 L66 44" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      {/* 입 - 자신감 있는 미소 */}
      <path d="M52 62 L58 65 L68 60" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* 머리카락 - 화살 모양 */}
      <path d="M35 38 L40 25 L50 32 L55 18 L60 8 L65 18 L70 32 L80 25 L85 38"
        fill="url(#dep-hair)" />
      {/* 화살 이펙트 */}
      <path d="M95 50 L110 50 M105 45 L110 50 L105 55" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <path d="M95 65 L105 65" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* 볼 터치 */}
      <circle cx="42" cy="58" r="4" fill="#F97316" opacity="0.4" />
      <circle cx="78" cy="58" r="4" fill="#F97316" opacity="0.4" />
      <defs>
        <linearGradient id="dep-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="dep-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="dep-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // DER - 감정 폭주러: 열정적인 하트와 소용돌이
  DER: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#der-bg)" opacity="0.2" />
      {/* 소용돌이 이펙트 */}
      <path d="M25 60 Q30 45 45 50 Q55 55 50 70 Q45 85 30 80" stroke="#FF6B9D" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M95 60 Q90 45 75 50 Q65 55 70 70 Q75 85 90 80" stroke="#FF6B9D" strokeWidth="2" fill="none" opacity="0.5" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#der-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 반짝이는 큰 눈 */}
      <ellipse cx="48" cy="50" rx="7" ry="8" fill="#1a1a1a" />
      <ellipse cx="72" cy="50" rx="7" ry="8" fill="#1a1a1a" />
      <circle cx="51" cy="47" r="3" fill="#fff" />
      <circle cx="75" cy="47" r="3" fill="#fff" />
      <circle cx="46" cy="52" r="1.5" fill="#fff" />
      <circle cx="70" cy="52" r="1.5" fill="#fff" />
      {/* 입 - 감정적인 열린 미소 */}
      <ellipse cx="60" cy="65" rx="8" ry="5" fill="#1a1a1a" />
      <ellipse cx="60" cy="63" rx="6" ry="3" fill="#FF6B9D" />
      {/* 머리카락 - 하트 모양 */}
      <path d="M60 15 Q40 10 35 28 Q30 45 60 35 Q90 45 85 28 Q80 10 60 15" fill="url(#der-hair)" />
      {/* 하트 이펙트 */}
      <path d="M20 35 Q22 30 25 33 Q28 30 30 35 Q30 40 25 45 Q20 40 20 35" fill="#FF6B9D" opacity="0.7" />
      <path d="M90 35 Q92 30 95 33 Q98 30 100 35 Q100 40 95 45 Q90 40 90 35" fill="#FF6B9D" opacity="0.7" />
      {/* 볼 터치 - 진한 홍조 */}
      <ellipse cx="40" cy="58" rx="6" ry="4" fill="#FF6B9D" opacity="0.5" />
      <ellipse cx="80" cy="58" rx="6" ry="4" fill="#FF6B9D" opacity="0.5" />
      <defs>
        <linearGradient id="der-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>
        <linearGradient id="der-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DB2777" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <linearGradient id="der-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#831843" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // ACP - 세계관 해석가: 돋보기와 별, 탐구적인 눈빛
  ACP: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#acp-bg)" opacity="0.2" />
      {/* 별 이펙트 */}
      <path d="M20 25 L22 30 L27 30 L23 34 L25 39 L20 36 L15 39 L17 34 L13 30 L18 30 Z" fill="#60A5FA" opacity="0.7" />
      <path d="M95 20 L96 23 L99 23 L97 25 L98 28 L95 26 L92 28 L93 25 L91 23 L94 23 Z" fill="#60A5FA" opacity="0.5" />
      <path d="M100 70 L101 73 L104 73 L102 75 L103 78 L100 76 L97 78 L98 75 L96 73 L99 73 Z" fill="#60A5FA" opacity="0.6" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#acp-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 안경 */}
      <circle cx="48" cy="50" r="10" stroke="#1E3A5F" strokeWidth="2.5" fill="none" />
      <circle cx="72" cy="50" r="10" stroke="#1E3A5F" strokeWidth="2.5" fill="none" />
      <path d="M58 50 L62 50" stroke="#1E3A5F" strokeWidth="2" />
      <path d="M38 48 L30 45" stroke="#1E3A5F" strokeWidth="2" />
      <path d="M82 48 L90 45" stroke="#1E3A5F" strokeWidth="2" />
      {/* 눈 - 호기심 가득 */}
      <circle cx="48" cy="50" r="4" fill="#1a1a1a" />
      <circle cx="72" cy="50" r="4" fill="#1a1a1a" />
      <circle cx="50" cy="48" r="1.5" fill="#fff" />
      <circle cx="74" cy="48" r="1.5" fill="#fff" />
      {/* 입 - 생각하는 표정 */}
      <ellipse cx="60" cy="64" rx="4" ry="2.5" fill="#1a1a1a" />
      {/* 머리카락 - 깔끔하고 지적인 */}
      <ellipse cx="60" cy="32" rx="25" ry="12" fill="url(#acp-hair)" />
      <path d="M38 35 Q35 25 42 22 Q50 18 60 20 Q70 18 78 22 Q85 25 82 35" fill="url(#acp-hair)" />
      {/* 볼 터치 */}
      <circle cx="38" cy="58" r="4" fill="#60A5FA" opacity="0.3" />
      <circle cx="82" cy="58" r="4" fill="#60A5FA" opacity="0.3" />
      <defs>
        <linearGradient id="acp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="acp-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="acp-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // ACR - 여운 수집가: 물결과 안개, 부드러운 분위기
  ACR: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#acr-bg)" opacity="0.2" />
      {/* 물결/안개 이펙트 */}
      <path d="M10 80 Q25 75 40 80 Q55 85 70 80 Q85 75 100 80" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M15 90 Q30 85 45 90 Q60 95 75 90 Q90 85 105 90" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.3" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#acr-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 몽환적이고 부드러운 */}
      <path d="M43 48 Q48 52 53 48" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M67 48 Q72 52 77 48" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* 속눈썹 */}
      <path d="M42 46 L44 43" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 44 L48 41" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M78 46 L76 43" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M72 44 L72 41" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      {/* 입 - 평온한 미소 */}
      <path d="M54 62 Q60 66 66 62" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 머리카락 - 흐르는 듯한 */}
      <path d="M32 40 Q30 25 45 20 Q60 15 75 20 Q90 25 88 40" fill="url(#acr-hair)" />
      <path d="M30 45 Q25 35 32 28" stroke="url(#acr-hair-strand)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M90 45 Q95 35 88 28" stroke="url(#acr-hair-strand)" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* 반짝이 */}
      <circle cx="25" cy="40" r="2" fill="#C4B5FD" opacity="0.7" />
      <circle cx="95" cy="45" r="1.5" fill="#C4B5FD" opacity="0.6" />
      {/* 볼 터치 - 부드러운 */}
      <ellipse cx="42" cy="58" rx="5" ry="3" fill="#DDD6FE" opacity="0.5" />
      <ellipse cx="78" cy="58" rx="5" ry="3" fill="#DDD6FE" opacity="0.5" />
      <defs>
        <linearGradient id="acr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="acr-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="acr-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="acr-hair-strand" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // AEP - 서사 해석가: 퍼즐과 연결된 구조
  AEP: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#aep-bg)" opacity="0.2" />
      {/* 퍼즐/연결 이펙트 */}
      <rect x="15" y="25" width="15" height="15" rx="2" fill="#10B981" opacity="0.4" />
      <rect x="25" y="35" width="10" height="10" rx="2" fill="#34D399" opacity="0.3" />
      <rect x="90" y="25" width="15" height="15" rx="2" fill="#10B981" opacity="0.4" />
      <rect x="85" y="35" width="10" height="10" rx="2" fill="#34D399" opacity="0.3" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#aep-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 분석적이고 집중하는 */}
      <ellipse cx="48" cy="50" rx="5" ry="5" fill="#1a1a1a" />
      <ellipse cx="72" cy="50" rx="5" ry="5" fill="#1a1a1a" />
      <circle cx="50" cy="48" r="2" fill="#fff" />
      <circle cx="74" cy="48" r="2" fill="#fff" />
      {/* 눈썹 - 생각하는 */}
      <path d="M43 43 L53 45" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M77 43 L67 45" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      {/* 입 - 만족스러운 미소 */}
      <path d="M52 62 Q60 68 68 62" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* 머리카락 - 정돈된 */}
      <path d="M35 38 Q38 22 50 18 Q60 15 70 18 Q82 22 85 38" fill="url(#aep-hair)" />
      <path d="M42 30 L48 25 L54 28 L60 22 L66 28 L72 25 L78 30" stroke="#065F46" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* 연결선 */}
      <path d="M30 45 L35 50" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M90 45 L85 50" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* 볼 터치 */}
      <circle cx="42" cy="58" r="4" fill="#6EE7B7" opacity="0.4" />
      <circle cx="78" cy="58" r="4" fill="#6EE7B7" opacity="0.4" />
      <defs>
        <linearGradient id="aep-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="aep-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="aep-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // AER - 여운 잠수부: 물방울과 깊은 바다, 부드러운 하트
  AER: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="url(#aer-bg)" opacity="0.2" />
      {/* 물방울 이펙트 */}
      <ellipse cx="20" cy="40" rx="4" ry="6" fill="#67E8F9" opacity="0.5" />
      <ellipse cx="100" cy="35" rx="3" ry="5" fill="#67E8F9" opacity="0.4" />
      <ellipse cx="25" cy="85" rx="3" ry="4" fill="#67E8F9" opacity="0.3" />
      {/* 작은 하트 */}
      <path d="M95 75 Q96 72 98 74 Q100 72 101 75 Q101 78 98 81 Q95 78 95 75" fill="#F9A8D4" opacity="0.6" />
      {/* 캐릭터 몸체 */}
      <ellipse cx="60" cy="68" rx="28" ry="32" fill="url(#aer-body)" />
      {/* 얼굴 */}
      <circle cx="60" cy="52" r="26" fill="#FFE5B4" />
      {/* 눈 - 깊고 따뜻한 */}
      <ellipse cx="48" cy="50" rx="6" ry="7" fill="#1a1a1a" />
      <ellipse cx="72" cy="50" rx="6" ry="7" fill="#1a1a1a" />
      <circle cx="50" cy="47" r="2.5" fill="#fff" />
      <circle cx="74" cy="47" r="2.5" fill="#fff" />
      <circle cx="47" cy="51" r="1" fill="#fff" />
      <circle cx="71" cy="51" r="1" fill="#fff" />
      {/* 입 - 온화한 미소 */}
      <path d="M52 62 Q60 68 68 62" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* 머리카락 - 부드럽게 흐르는 */}
      <path d="M32 42 Q28 25 45 18 Q60 12 75 18 Q92 25 88 42" fill="url(#aer-hair)" />
      <path d="M30 48 Q22 35 30 25" stroke="#164E63" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M90 48 Q98 35 90 25" stroke="#164E63" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* 물결 무늬 머리 장식 */}
      <path d="M45 20 Q50 17 55 20 Q60 23 65 20 Q70 17 75 20" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* 볼 터치 - 따뜻한 핑크 */}
      <ellipse cx="40" cy="58" rx="6" ry="4" fill="#FDA4AF" opacity="0.4" />
      <ellipse cx="80" cy="58" rx="6" ry="4" fill="#FDA4AF" opacity="0.4" />
      <defs>
        <linearGradient id="aer-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="aer-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="100%" stopColor="#155E75" />
        </linearGradient>
        <linearGradient id="aer-hair" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#134E4A" />
          <stop offset="100%" stopColor="#164E63" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

export function TasteResultCharacter({ code, className = '' }: TasteResultCharacterProps) {
  const character = CHARACTER_SVG[code];

  if (!character) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* 글로우 이펙트 */}
      <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-netflix-red/20 to-transparent blur-2xl" />
      {/* 캐릭터 */}
      <div className="relative drop-shadow-2xl">
        {character}
      </div>
    </div>
  );
}
