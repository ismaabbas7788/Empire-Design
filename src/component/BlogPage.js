import React from "react";
import "../BlogPage.css";

function BlogPage() {
  return (
    <div className="container py-5 blog-page">

      {/* First Blog Entry */}
      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <h2 className="blog-title mb-4">Top 5 Interior Design Trends of the Year</h2>
          <p className="lead text-muted mb-4">
            Step into the world of style and sophistication with our latest blog, where we explore the top interior design trends shaping modern living spaces. Whether you're planning a full home makeover or simply looking to refresh a single room, these trends offer the perfect blend of comfort, functionality, and visual appeal. From the calming embrace of earthy tones to the rise of biophilic design and multifunctional layouts, this year’s trends are all about creating spaces that feel both personal and purposeful. Discover how to stay ahead of the design curve and bring timeless elegance into your home with ideas that inspire and elevate.
          </p>
        </div>
        <div className="col-lg-5 text-end">
          <img
            src="/images/blog.jpg"
            alt="Interior Trends"
            className="img-fluid rounded-4 shadow blog-image"
          />
        </div>
      </div>

      <div className="full-text mt-2">
        <div className="blog-section">
          <h4>1. Nature-Inspired Palettes and Materials</h4>
          <p>
            Earthy hues like clay, sage, and sand bring warmth and serenity to interiors. Paired with raw textures such as jute,
            bamboo, and unfinished wood, they create calming, grounded spaces that reconnect us to the natural world.
          </p>
        </div>

        <div className="blog-section">
          <h4>2. Purposeful Minimalism with Warmth</h4>
          <p>
            This trend embraces functionality without losing character. Clean lines and decluttered areas are enhanced with soft
            neutrals, cozy textures, and curated pieces, making minimalism feel inviting instead of sterile.
          </p>
        </div>

        <div className="blog-section">
          <h4>3. Statement Lighting as Art</h4>
          <p>
            Lighting isn’t just functional anymore — it’s sculptural. Bold pendants, geometric fixtures, and artistic lighting
            designs serve as visual anchors and bring dramatic flair to every room.
          </p>
        </div>

        <div className="blog-section">
          <h4>4. Biophilic Design and Indoor Greenery</h4>
          <p>
            The presence of nature indoors continues to rise. Think lush indoor plants, living walls, and large windows that flood
            rooms with light. This design principle improves air quality and mental well-being.
          </p>
        </div>

        <div className="blog-section">
          <h4>5. Flexible and Multi-Use Spaces</h4>
          <p>
            As remote work and hybrid living expand, so does the need for versatile layouts. Furniture that adapts, rooms that
            convert, and smart storage ensure every inch of your home works harder and smarter.
          </p>
        </div>

        <p className="mt-4 text-secondary">
          Whether you're redesigning a corner or the whole home, these trends reflect a future where design is both beautiful
          and meaningful. Let your space tell your story.
        </p>
      </div>

      {/* Second Blog Entry */}
      <hr className="my-5" />
                     <h2 className="blog-title mb-4">"Designing for Wellness: How Interiors Are Evolving for Better Living"
</h2>

      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <p className="lead text-muted mb-4">
          
            Creating a home is more than arranging furniture and painting walls — it’s about crafting a lifestyle. In recent months, the concept of holistic design has gained momentum, focusing on how spaces can support mental wellness, productivity, and emotional balance. Designers are leaning into cozy corners with soft lighting, calming textures like boucle and linen, and sensory-friendly layouts that encourage mindfulness. Open-concept spaces are being reimagined with movable dividers and quiet zones, giving families the ability to adapt their environments based on changing needs. These thoughtful design shifts signal a new era in home decor — one that puts well-being at the heart of the home.
         One of the most significant trends shaping today’s design philosophy is mental wellness-focused design. Designers and homeowners alike are becoming more intentional about how spaces influence mood, focus, and comfort. It starts with materials — calming textures like bouclé, linen, raw cotton, and matte woods evoke a sense of calm and are being layered into interiors for warmth and tactile comfort. These textures bring not only beauty but emotional softness, helping spaces feel safer and more nurturing.
          </p>
        </div>
        <div className="col-lg-5 text-end">
          <img
            src="/images/blog2.jpg"
            alt="Holistic Design"
            className="img-fluid rounded-4 shadow blog-image"
          />
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
