import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";
import Link from "next/link";

export default function Bio() {
  return (
    <BaseBlock className="max-w-[800px] md:mx-auto">
      <BaseBlockHeading>About</BaseBlockHeading>
      <p className="mt-6">
        As an entrepreur I understand that Software Engineering is not about
        building the shiniest solutions. What really matters is solving the
        problem at hand. I can help you solve problems and create software that
        makes the impact you are looking for.
      </p>
      <p className="mt-4">
        Over the years of my career I have learned that every situation requires
        a different approach. The tools that we use are just that, tools. That’s
        why I&apos;ve familiarized myself with a broad range of tools. React is
        sometimes the right tool for the job. WordPress is sometimes the right
        tool for the job. X/Y/Z is sometimes the right tool…
      </p>
      <p className="mt-4">
        I firmly believe that creating the right software will improve
        anyone&apos;s life tremendously.
      </p>
      <div className="mt-4">
        <ul>
          <li className="hidden print:block">
            <strong>Phone</strong>: +31 6 11920738
          </li>
          <li>
            <strong>Email</strong>:{" "}
            <Link href="email:anton@24letters.com" className="underline">
              anton@24letters.com
            </Link>
          </li>
          <li>
            <strong>LinkedIn</strong>:{" "}
            <Link
              href="https://www.linkedin.com/in/atimmer/"
              className="underline"
            >
              https://www.linkedin.com/in/atimmer/
            </Link>
          </li>
          <li>
            <strong>KVK</strong>: 89299868
          </li>
        </ul>
      </div>
    </BaseBlock>
  );
}
