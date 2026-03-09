type InViewOptions = IntersectionObserverInit & {
	once?: boolean
	onEnter?: () => void
}

export function inView(node: HTMLElement, opts: InViewOptions = {}) {
	const { threshold = 0.15, root = null, rootMargin = "0px", once = true, onEnter } = opts

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry?.isIntersecting) {
				onEnter?.()
				if (once) observer.disconnect()
			}
		},
		{ threshold, root, rootMargin }
	)

	observer.observe(node)

	return {
		destroy() {
			observer.disconnect()
		}
	}
}
