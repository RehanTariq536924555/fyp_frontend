
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
				serif: ['Georgia', 'serif'],
			},
			colors: {
				border: 'rgb(234, 234, 234)',
				input: 'rgb(234, 234, 234)',
				ring: 'rgb(234, 234, 234)',
				background: 'rgb(255, 255, 255)',
				foreground: 'rgb(17, 17, 17)',
				primary: {
					DEFAULT: 'rgb(17, 17, 17)',
					foreground: 'rgb(255, 255, 255)'
				},
				secondary: {
					DEFAULT: 'rgb(243, 243, 243)',
					foreground: 'rgb(17, 17, 17)'
				},
				destructive: {
					DEFAULT: 'rgb(235, 87, 87)',
					foreground: 'rgb(255, 255, 255)'
				},
				muted: {
					DEFAULT: 'rgb(245, 245, 245)',
					foreground: 'rgb(115, 115, 115)'
				},
				accent: {
					DEFAULT: 'rgb(243, 243, 243)',
					foreground: 'rgb(17, 17, 17)'
				},
				popover: {
					DEFAULT: 'rgb(255, 255, 255)',
					foreground: 'rgb(17, 17, 17)'
				},
				card: {
					DEFAULT: 'rgb(255, 255, 255)',
					foreground: 'rgb(17, 17, 17)'
				},
				sidebar: {
					DEFAULT: 'rgb(252, 252, 252)',
					foreground: 'rgb(17, 17, 17)',
					primary: 'rgb(17, 17, 17)',
					'primary-foreground': 'rgb(255, 255, 255)',
					accent: 'rgb(243, 243, 243)',
					'accent-foreground': 'rgb(17, 17, 17)',
					border: 'rgb(234, 234, 234)',
					ring: 'rgb(234, 234, 234)'
				}
			},
			borderRadius: {
				lg: '16px',
				md: '12px',
				sm: '8px'
			},
			boxShadow: {
				'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'medium': '0 8px 30px rgba(0, 0, 0, 0.08)',
				'strong': '0 12px 40px rgba(0, 0, 0, 0.12)',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-out': 'fade-out 0.5s ease-out forwards',
				'slide-in': 'slide-in 0.5s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out forwards',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	// plugins: [require("tailwindcss-animate")]
} satisfies Config;
