import Image from 'next/image'
import { ChevronDownIcon, HomeIcon } from '@heroicons/react/solid'
const Header = () => {
  return (
    <div className="flex bg-white px-4 py-2 shadow-sm">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Image
          objectFit="contain"
          src="https://links.papareact.com/fqy"
          layout="fill"
        />
      </div>
      <div className="mx-7 flex items-center">
        <HomeIcon className="h-5 w-5" />
        <p>Home</p>
        <ChevronDownIcon className="h5 w-5" />
      </div>
    </div>
  )
}

export default Header
