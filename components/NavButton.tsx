import React from 'react'

interface Props {
  title: string
  isActive?: boolean
  onClick?: () => void
}

const NavButton = ({ title, isActive, onClick }: Props) => {
  return (
    <button
      className={`text-white py-2 px-4 rounded transition-all duration-200 ${
        isActive && 'bg-[#a12a6d]'
      } ${
        title === 'Logout' &&
        'border-2 py-[5.5px] text-[#d52f8d] border-[#d52f8d] hover:text-[#070707] hover:bg-[#d52f8d]'
      } hover:bg-[#d52f8d] font-bold`}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default NavButton
