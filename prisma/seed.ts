import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sacredblog.org" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@sacredblog.org",
      password: hashedPassword,
    },
  });

  console.log("✅ Created admin user:", admin.email);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "faith" },
      update: {},
      create: {
        name: "Faith",
        slug: "faith",
        description: "Articles about faith and belief",
        color: "#6366f1",
      },
    }),
    prisma.category.upsert({
      where: { slug: "community" },
      update: {},
      create: {
        name: "Community",
        slug: "community",
        description: "Community news and events",
        color: "#22c55e",
      },
    }),
    prisma.category.upsert({
      where: { slug: "teachings" },
      update: {},
      create: {
        name: "Teachings",
        slug: "teachings",
        description: "Religious teachings and wisdom",
        color: "#8b5cf6",
      },
    }),
    prisma.category.upsert({
      where: { slug: "reflections" },
      update: {},
      create: {
        name: "Reflections",
        slug: "reflections",
        description: "Personal reflections and meditations",
        color: "#ec4899",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.map((c: { name: string }) => c.name).join(", "));

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "prayer" },
      update: {},
      create: { name: "Prayer", slug: "prayer" },
    }),
    prisma.tag.upsert({
      where: { slug: "meditation" },
      update: {},
      create: { name: "Meditation", slug: "meditation" },
    }),
    prisma.tag.upsert({
      where: { slug: "scripture" },
      update: {},
      create: { name: "Scripture", slug: "scripture" },
    }),
    prisma.tag.upsert({
      where: { slug: "inspiration" },
      update: {},
      create: { name: "Inspiration", slug: "inspiration" },
    }),
    prisma.tag.upsert({
      where: { slug: "guidance" },
      update: {},
      create: { name: "Guidance", slug: "guidance" },
    }),
  ]);

  console.log("✅ Created tags:", tags.map((t: { name: string }) => t.name).join(", "));

  const article = await prisma.article.upsert({
    where: { slug: "welcome-to-sacred-blog" },
    update: {},
    create: {
      title: "Welcome to Sacred Blog",
      slug: "welcome-to-sacred-blog",
      excerpt: "We are delighted to welcome you to our new online home for spiritual reflection and community connection.",
      content: `
        <h2>A New Beginning</h2>
        <p>Welcome to Sacred Blog, a digital sanctuary for spiritual growth, community connection, and religious teachings. We are thrilled to launch this platform as a space where faith meets the modern world.</p>
        
        <h2>Our Mission</h2>
        <p>Our mission is to provide a welcoming space for all seekers of spiritual wisdom. Whether you are deeply rooted in your faith or just beginning your spiritual journey, you will find resources, reflections, and community here.</p>
        
        <h3>What You'll Find Here</h3>
        <ul>
          <li><strong>Weekly Reflections</strong> - Thoughtful meditations on scripture and spiritual life</li>
          <li><strong>Community News</strong> - Updates on events, gatherings, and celebrations</li>
          <li><strong>Teaching Series</strong> - In-depth explorations of religious texts and traditions</li>
          <li><strong>Prayer Resources</strong> - Guides and inspiration for your prayer life</li>
        </ul>
        
        <blockquote>
          "For where two or three gather in my name, there am I with them."
        </blockquote>
        
        <h2>Join Our Community</h2>
        <p>We invite you to engage with our content, share your thoughts in the comments, and become part of our growing online community. Together, we can support each other on our spiritual journeys.</p>
        
        <p>May you find peace, inspiration, and connection here.</p>
        
        <p><em>With blessings,<br>The Sacred Blog Team</em></p>
      `,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id,
      metaTitle: "Welcome to Sacred Blog - Your Spiritual Home Online",
      metaDescription: "Join our community for spiritual reflection, religious teachings, and faith-based content. Welcome to Sacred Blog.",
    },
  });

  console.log("✅ Created sample article:", article.title);

  await prisma.tagsOnArticles.createMany({
    data: [
      { articleId: article.id, tagId: tags[3].id },
      { articleId: article.id, tagId: tags[4].id },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Linked tags to article");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Admin login credentials:");
  console.log("   Email: admin@sacredblog.org");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
