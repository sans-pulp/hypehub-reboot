import type { Config } from 'tailwindcss'

export default {
    darkMode: ['class'],
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-press-start)'],
        body: ['var(--font-exo2)'],
        grotesk: ['var(--font-space-grotesk)'],
      },
      colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			game: {
				attribute: {
					strength: '#CC2936',    // Blood red - physical power and raw force
					knowledge: '#3B82F6',   // Sky blue - mental acuity and learning
					vitality: '#22C55E',    // Forest green - health and endurance
					social: '#F59E0B',      // Warm yellow - charisma and connection
					willpower: '#1E293B',   // Deep blue gray - deep concentration and resolve
				},
				status: {
					damage: '#E63946',      // Soft crimson - dangerous but not harsh
					heal: '#4C8162',        // Sage green - soothing and natural
					buff: '#F58C57',        // Coral orange - warm and energetic
					debuff: '#457B9D'       // Steel blue - cold and hindering
				},
				rarity: {
					common: '#7E8A9A',      // Steel gray - basic but not dull
					uncommon: '#45B669',    // Emerald green - fresh and distinct
					rare: '#4481E5',        // Electric blue - bright and valuable
					epic: '#A241E8',        // Royal purple - mystical and rare
					legendary: '#D5A536'    // Gold - the rarest and most exclusive
				},
				goal: {
					daily: '#4CC7AF',       // Turquoise - fresh, approachable, everyday
					mission: '#7B6CF6',     // Royal purple - important, challenging
					quest: '#E74694'        // Magenta - epic, prestigious, standout
				}
			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
