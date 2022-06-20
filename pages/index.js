import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <ul>
        <li>
          <Link href="/airdrop">Airdrop</Link>
        </li>
        <li>
          <Link href="/selltokens">Static Seller</Link>
        </li>
      </ul>
    </>
  );
}
