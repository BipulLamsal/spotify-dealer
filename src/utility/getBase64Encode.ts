async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.arrayBuffer();

    const contentType = response.headers.get("content-type") || "";

    const base64String = `data:${contentType};base64,${Buffer.from(
      blob
    ).toString("base64")}`;

    return base64String;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch or convert image to base64");
  }
}
export default imageUrlToBase64;
