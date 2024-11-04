import { LinkField } from '@prismicio/client'
import { PrismicNextLink } from '@prismicio/next'
import clsx from 'clsx';

type Props = {
    buttonLink: LinkField;
    buttonText: string | null; /** values can be either a string or null */
    className?: string; /** ? symbol to mark a prop or parameter as optional */
}

export default function Button({buttonLink, buttonText, className}: Props) {
  return (
    <PrismicNextLink 
    className={clsx("rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-black uppercase tracking-widest text-white transition-colors duration-150 hover:bg-orange-700 ", className)}
    field={buttonLink}>
    {buttonText}
  </PrismicNextLink>
  )
}