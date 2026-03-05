import {
  filterBySearch,
  rules,
  sortRules,
  type EslintRule,
} from "@/lib/rules-data";

describe("rules-data", () => {
  describe("sortRules", () => {
    it("sorts by column ascending", () => {
      const result = sortRules(rules, "id", "asc");
      expect(result.map((r) => r.id)).toEqual([
        "eqeqeq",
        "import/no-duplicates",
        "no-unused-vars",
      ]);
    });

    it("sorts by column descending", () => {
      const result = sortRules(rules, "id", "desc");
      expect(result.map((r) => r.id)).toEqual([
        "no-unused-vars",
        "import/no-duplicates",
        "eqeqeq",
      ]);
    });

    it("sorts by description", () => {
      const result = sortRules(rules, "description", "asc");
      expect(result[0].description).toContain("Disallow");
      expect(result[result.length - 1].description).toContain("Require");
    });

    it("sorts by category", () => {
      const result = sortRules(rules, "category", "asc");
      expect(result.map((r) => r.category)).toEqual([
        "Best Practices",
        "Style",
        "Variables",
      ]);
    });

    it("does not mutate the original array", () => {
      const copy = [...rules];
      sortRules(rules, "id", "asc");
      expect(rules).toEqual(copy);
    });

    it("handles null/undefined values", () => {
      const list: EslintRule[] = [
        { ...rules[0], category: null },
        { ...rules[1], category: "A" },
      ];
      const result = sortRules(list, "category", "asc");
      expect(result.length).toBe(2);
    });
  });

  describe("filterBySearch", () => {
    it("returns all rules when query is empty", () => {
      expect(filterBySearch(rules, "")).toHaveLength(rules.length);
      expect(filterBySearch(rules, "   ")).toHaveLength(rules.length);
    });

    it("filters by rule id (case insensitive)", () => {
      const result = filterBySearch(rules, "eqeqeq");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("eqeqeq");
    });

    it("filters by package name", () => {
      const result = filterBySearch(rules, "eslint-plugin-import");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("import/no-duplicates");
    });

    it("filters by description", () => {
      const result = filterBySearch(rules, "unused variables");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("no-unused-vars");
    });

    it("filters by category", () => {
      const result = filterBySearch(rules, "Best Practices");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("eqeqeq");
    });

    it("returns empty array when no match", () => {
      expect(filterBySearch(rules, "xyznonexistent")).toHaveLength(0);
    });

    it("trims the search query", () => {
      const result = filterBySearch(rules, "  eqeqeq  ");
      expect(result).toHaveLength(1);
    });
  });

  describe("rules from fixture", () => {
    it("loads rules with uniqueId", () => {
      expect(rules.length).toBeGreaterThanOrEqual(3);
      rules.forEach((r) => {
        expect(r.uniqueId).toBeDefined();
        expect(r.uniqueId).toContain(r.id);
        expect(r.uniqueId).toContain(r.package);
      });
    });

    it("has no duplicate uniqueIds", () => {
      const ids = rules.map((r) => r.uniqueId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
