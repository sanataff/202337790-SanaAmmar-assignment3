import type { VisitorType } from '../data/visitorTypes';

/**
 * A small hand-drawn reception desk: a receptionist, counter, bell, guest book
 * and a visitor badge. The bell gives a little ring each time a new visitor
 * type is picked.
 *
 * Decorative only — the switcher beside it carries the real controls, so the
 * whole drawing is hidden from assistive technology.
 */
export default function ReceptionDesk({ visitorType }: { visitorType: VisitorType }) {
  return (
    <svg
      className="welcome-desk"
      viewBox="40 40 400 310"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="welcome-desk-wobble" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* No background panel: the drawing sits directly on the page paper. */}

      {/* Ink linework */}
      <g
        fill="none"
        stroke="var(--desk-ink)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#welcome-desk-wobble)"
      >
        {/* the receptionist, standing behind the counter */}
        <g key={`person-${visitorType}`}>
          <g>
            <circle cx="254" cy="94" r="6.5" fill="var(--desk-hair)" stroke="none" />
            <circle cx="254" cy="118" r="20" fill="var(--desk-paper)" />
            <path
              d="M 234 114 C 232 96 276 96 274 114 C 268 104 240 104 234 114 Z"
              fill="var(--desk-hair)"
              stroke="none"
            />
            <circle cx="247" cy="120" r="2.2" fill="var(--desk-ink)" stroke="none" />
            <circle cx="261" cy="120" r="2.2" fill="var(--desk-ink)" stroke="none" />
            <path d="M 248 128 Q 254 133 260 128" strokeWidth="3" />
            <path
              className="welcome-desk__limb"
              d="M 248 138 L 248 147 M 260 138 L 260 147"
              strokeWidth="4"
            />
          </g>
          <path
            d="M 218 214 C 217 184 229 151 254 151 C 279 151 291 184 290 214 Z"
            fill="var(--desk-accent)"
          />
          <path d="M 244 152 L 254 167 L 264 152" stroke="var(--desk-paper)" strokeWidth="4" />
          <path className="welcome-desk__limb" d="M 284 178 C 296 188 302 199 304 212" />
          <path
            className="welcome-desk__limb welcome-desk__arm-rest"
            d="M 224 178 C 212 188 206 199 204 212"
          />
        </g>

        {/* counter top */}
        <path
          d="M 66 214 C 140 209 340 209 414 214 C 420 220 420 236 414 242 C 338 248 142 248 66 242 C 60 236 60 220 66 214 Z"
          fill="var(--desk-surface)"
        />
        <path d="M 78 236 C 158 240 322 240 402 236" strokeWidth="3" />

        {/* front panel, drawn to the floor like a proper reception podium */}
        <path
          d="M 92 244 C 88 244 86 248 86 254 L 82 316 C 150 322 330 322 398 316 L 394 254 C 394 248 392 244 388 244 Z"
          fill="var(--desk-surface)"
        />
        <path d="M 90 310 C 160 315 320 315 390 310" strokeWidth="3" strokeOpacity="0.5" />
        <path
          className="welcome-desk__limb"
          d="M 92 335 C 170 330 320 331 392 335"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />

        {/* guest book, open with a cursive signature */}
        <path
          d="M 84 208 C 108 190 130 192 142 198 C 156 192 178 190 200 208 L 196 220 C 174 210 154 208 142 214 C 130 208 110 210 88 220 Z"
          fill="var(--desk-paper)"
          strokeWidth="4.5"
        />
        <path d="M 142 198 L 142 215" strokeWidth="3.5" />
        <path d="M 94 208 C 106 200 122 199 132 203" strokeWidth="3" />
        <path
          d="M 154 203 C 158 198 164 198 167 202 C 170 206 175 206 178 201"
          strokeWidth="3"
        />

        {/* the top page folds over onto the left whenever a visitor is chosen */}
        <g key={`page-${visitorType}`} className="welcome-desk__page">
          {/* the back of the page, landing on the left */}
          <g className="welcome-desk__page-back">
            <path
              d="M 142 198 C 124 199 104 203 84 208 L 88 220 C 110 210 130 208 142 214 Z"
              fill="var(--desk-surface)"
              strokeWidth="3.5"
            />
            <path d="M 132 203 C 120 203 109 205 98 208" strokeWidth="2.5" strokeOpacity="0.35" />
          </g>

          {/* the top face, lifting away from the right page */}
          <g className="welcome-desk__page-front">
            <path
              d="M 142 198 C 160 199 180 203 200 208 L 196 220 C 174 210 154 208 142 214 Z"
              fill="var(--desk-paper)"
              strokeWidth="3.5"
            />
            <path d="M 152 204 C 164 204 175 206 186 209" strokeWidth="2.5" strokeOpacity="0.4" />
            <path d="M 151 209 C 163 209 174 211 184 213" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M 192 208 C 194 211 194 215 192 218" strokeWidth="2" strokeOpacity="0.35" />
          </g>
        </g>

        {/* she reaches from behind the book and turns the page */}
        <g key={`reach-${visitorType}`} className="welcome-desk__reach">
          <path
            d="M 224 178 C 210 186 200 196 190 203"
            stroke="var(--desk-limb)"
            strokeWidth="5.5"
          />
          <path
            d="M 178 204 C 178 199 184 197 188 199 C 192 201 192 205 189 207 C 185 209 180 208 178 204 Z"
            fill="var(--desk-paper)"
            strokeWidth="4"
          />
          <path d="M 185 199 C 184 196 188 195 189 198" strokeWidth="3" />
        </g>

        {/* lanyard + visitor badge resting on the desk front */}
        <g className="welcome-desk__badge">
          <path
            className="welcome-desk__limb"
            d="M 226 246 L 221 268 M 252 246 L 257 268"
            strokeWidth="4"
          />
          <g transform="rotate(-3 240 288)">
            <path
              d="M 208 266 Q 208 262 212 262 L 268 262 Q 272 262 272 266 L 272 306 Q 272 310 268 310 L 212 310 Q 208 310 208 306 Z"
              fill="var(--desk-paper)"
            />
            <path d="M 240 262 L 240 267" strokeWidth="3" />
            <circle cx="226" cy="280" r="6.5" fill="var(--desk-accent)" stroke="none" />
            <path d="M 216 297 C 217 288 235 288 236 297" strokeWidth="4" />
            <path d="M 245 278 Q 254 274 264 278 M 245 288 Q 254 284 262 287" strokeWidth="3.5" />
          </g>
        </g>

        {/* the bell — remounted on every visitor choice to ring once */}
        <g key={`bell-${visitorType}`}>
          <g className="welcome-desk__ding">
            <path d="M 304 190 C 298 198 298 206 302 212" strokeWidth="4" strokeOpacity="0.75" />
            <path d="M 294 184 C 285 196 285 208 291 216" strokeWidth="4" strokeOpacity="0.55" />
            <path d="M 370 190 C 376 198 376 206 372 212" strokeWidth="4" strokeOpacity="0.75" />
            <path d="M 380 184 C 389 196 389 208 383 216" strokeWidth="4" strokeOpacity="0.55" />
          </g>

          <g className="welcome-desk__bell">
            <ellipse
              cx="337"
              cy="214"
              rx="27"
              ry="5"
              fill="var(--desk-accent)"
              strokeWidth="4.5"
            />
            <path
              d="M 318 211 C 316 197 323 184 337 184 C 351 184 358 197 356 211 Z"
              fill="var(--desk-accent)"
              strokeWidth="4.5"
            />
            <circle cx="337" cy="179" r="4.5" fill="var(--desk-ink)" stroke="none" />
            <path
              d="M 327 198 C 328 192 332 188 337 187"
              stroke="var(--desk-highlight)"
              strokeWidth="3"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
