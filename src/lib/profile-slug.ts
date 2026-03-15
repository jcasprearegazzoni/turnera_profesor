function slugifyProfileName(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "perfil";
}

export async function generateUniqueProfileSlug(
  name: string,
  findProfileBySlug: (slug: string) => Promise<{ user_id: string | null } | null>,
  currentUserId?: string
) {
  const baseSlug = slugifyProfileName(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existingProfile = await findProfileBySlug(candidate);

    if (!existingProfile || existingProfile.user_id === currentUserId) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
