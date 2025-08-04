import React from "react";
import { CheckCircle, Gift, Star, Users, ShieldCheck } from "lucide-react";

const CommunityRules = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-200">
      <h1 className="text-4xl font-bold text-center mb-6 text-green-700">
        ♻️ Community Rules
      </h1>

      <p className="text-lg text-center mb-10">
        Welcome to <span className="font-semibold">Give for Good</span>, your
        local zero-waste hub where generosity meets sustainability!  
        Please follow these simple rules to keep our community safe and helpful.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Gift size={20} /> What You Can Share
        </h2>
        <ul className="list-disc list-inside space-y-2 text-base">
          <li>Items must be <strong>100% free</strong>. No selling or trading allowed.</li>
          <li>Share only <strong>appropriate and usable</strong> items. No damaged or incomplete products unless clearly stated.</li>
          <li><strong>No expired or unsafe</strong> items, especially food, cosmetics, or medicines.</li>
          <li>Items should be <strong>clean and ready-to-use</strong>.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Users size={20} /> Respect the Spirit of Giving
        </h2>
        <ul className="list-disc list-inside space-y-2 text-base">
          <li><strong>Be honest</strong> with your listings – include real photos and descriptions.</li>
          <li><strong>Give others a chance</strong> to participate — avoid claiming everything.</li>
          <li><strong>Respect meet-up times and locations.</strong> Communicate clearly if plans change.</li>
          <li><strong>No spam, hate speech, or harassment</strong>. Keep the space respectful.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Star size={20} /> Point System
        </h2>
        <p className="mb-2">Earn points for giving and helping others:</p>
        <ul className="list-disc list-inside space-y-2 text-base">
          <li><strong>+10 points</strong> – For listing a new item</li>
          <li><strong>+5 points</strong> – When your item is claimed</li>
          <li><strong>+2 points</strong> – For marking it as picked up</li>
          <li><strong>Bonus points</strong> – For consistent, responsible sharing</li>
        </ul>
        <p className="mt-2">
          Points help build your reputation and may unlock future badges or features.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={20} /> Keep Helping, Keep Giving
        </h2>
        <p className="text-base">
          Every item you give keeps waste out of landfills and helps someone in need.
          Thank you for being part of a community that gives freely and cares deeply.
        </p>
      </section>
    </div>
  );
};

export default CommunityRules;
