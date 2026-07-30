type SectionHeaderProps = {
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
};

export default function SectionHeader({
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: "20px", textAlign: align }}>
      <h2
        style={{
          /* clamp(MIN, PREFERRED, MAX) 
             Mobile me ~1.25rem, Screen ke hisab se scale hoga, aur Desktop par max 1.75rem rahega */
          fontSize: "clamp(1.52rem, 4vw, 1.95rem)",
          fontWeight: 800,
          lineHeight: 1.25,
          color: "#0f172a",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            marginTop: "6px",
            color: "#64748b",
            fontSize: "clamp(0.95rem, 2vw, 1rem)",
            lineHeight: 1.4,
            margin: "6px 0 0 0",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}