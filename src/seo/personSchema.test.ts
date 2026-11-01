import { describe, expect, it } from "vite-plus/test";
import { personSchema, personSchemaScript } from "./personSchema";

describe("personSchema", () => {
  it("links the profile to its public accounts only", () => {
    expect(personSchema.sameAs).toEqual([
      "https://github.com/raflisetiawan",
      "https://www.linkedin.com/in/rafli-setiawan-820b62227",
    ]);
  });

  it("uses the site's absolute address", () => {
    expect(personSchema.url).toBe("https://raflisetiawan.tech/");
  });

  it("keeps the phone number and confidential terms out", () => {
    expect(JSON.stringify(personSchema)).not.toMatch(
      /81334388233|Peruri|Kemendikdasmen|Nine-Box|worksFor/,
    );
  });
});

describe("personSchemaScript", () => {
  it("produces valid JSON inside a script tag", () => {
    const script = personSchemaScript();
    const json = script.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(JSON.parse(json)).toEqual(personSchema);
  });

  it("contains only the closing tag it adds itself", () => {
    expect(personSchemaScript().match(/<\/script/g)).toHaveLength(1);
  });
});
