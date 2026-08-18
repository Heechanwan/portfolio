import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ScrollReveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  style = {},
  ...props
}) {
  const ref = useScrollReveal()

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(36px) scale(0.985)',
        filter: 'blur(4px)',
        transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform, filter',
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
