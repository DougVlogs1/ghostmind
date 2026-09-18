interface ProgressBarProps {
  percentage: number
  color?: 'br-green' | 'br-blue' | 'br-yellow'
}

export default function ProgressBar({ percentage, color = 'br-green' }: ProgressBarProps) {
  // Determina a cor com base na propriedade color
  const getColorClasses = () => {
    switch (color) {
      case 'br-blue':
        return 'bg-br-blue'
      case 'br-yellow':
        return 'bg-br-yellow'
      default:
        return 'bg-br-green'
    }
  }

  const bgColorClass = getColorClasses()

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${bgColorClass} h-2.5 rounded-full`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}