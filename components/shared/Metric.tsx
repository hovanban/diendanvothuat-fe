import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title?: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
  authorUsername?: string;
}

const Metric = ({ imgUrl, alt, value, title, href, textStyles, isAuthor, authorUsername }: MetricProps) => {
  const content = (
    <>
      {isAuthor && authorUsername ? (
        <UserAvatar picture={imgUrl} name={value.toString()} username={authorUsername} size={16} />
      ) : (
        <Image src={imgUrl} width={16} height={16} alt={alt} className={`object-contain ${href ? "rounded-full" : ""}`} />
      )}
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}>{title}</span>
      </p>
    </>
  );

  if (href) return <Link href={href} className="flex-center gap-1">{content}</Link>;
  return <div className="flex-center flex-wrap gap-1">{content}</div>;
};

export default Metric;
