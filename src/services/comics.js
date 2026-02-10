
export const getComics = async () => {
  try {
    const response = await fetch(
      "https://gateway.marvel.com/v1/public/comics?ts=1&apikey=40ba97c405fd1a6eca96a36b60924985&hash=3613599b4ae4c6d3bda13349ef1d7167ffd8ab03"
    );
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error("Error fetching comics:", error);
    return [];
  }
};