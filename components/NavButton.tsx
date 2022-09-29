import React from 'react'

interface Props {
  title: string
  isActive?: boolean
  onClick?: () => void
}

const NavButton = ({ title, isActive, onClick }: Props) => {
  return (
    <button
      className={`text-white py-2 px-4 rounded ${
        isActive && 'bg-[#6f194a]'
      } hover:bg-[#d52f8d] font-bold`}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default NavButton
