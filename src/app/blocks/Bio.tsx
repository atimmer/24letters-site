import BaseBlock from "@/app/blocks/BaseBlock";
import BaseBlockHeading from "@/app/blocks/BaseBlockHeading";

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
        why I’ve familiarized myself with a broad range of different kinds of
        tools. React is sometimes the right tool for the job. WordPress is
        sometimes the right tool for the job. X is sometimes the right tool…
      </p>
      <p className="mt-4">
        It is my belief that people’s lives can be improved tremendously by
        creating the right software.
      </p>
      <p className="mt-4">
        <ul>
          <li>
            <strong>Phone</strong>: +31 6 11920738
          </li>
          <li>
            <strong>Email</strong>: anton@24letters.com
          </li>
          <li>
            <strong>Website</strong>: 24letters.com
          </li>
          <li>
            <strong>LinkedIn</strong>: https://www.linkedin.com/in/atimmer/
          </li>
          <li>
            <strong>KVK</strong>: 89299868
          </li>
        </ul>
      </p>
    </BaseBlock>
  );
}
