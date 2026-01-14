import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import { useCart } from "../hooks/useCart";

// Моковые данные товаров
const mockProducts = [
  {
    id: 1,
    name: "Куртка строительная",
    description: "Куртка для строителей",
    image: "https://picsum.photos/300/200?random=1",
    price: 1500,
    category: "Спецодежда",
    sizes: [
      { size: "M", available: true },
      { size: "L", available: false },
    ],
  },
  {
    id: 2,
    name: "Перчатки медицинские",
    description: "Перчатки для медицинского персонала",
    image: "https://picsum.photos/300/200?random=2",
    price: 200,
    category: "Перчатки",
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
    ],
  },
  {
    id: 3,
    name: "Ботинки рабочие",
    description: "Ботинки для работы",
    image: "https://picsum.photos/300/200?random=3",
    price: 2500,
    category: "Спецобувь",
    sizes: [
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },
  {
    id: 4,
    name: "Шлем защитный",
    description: "Шлем для защиты головы на стройке",
    image: "https://picsum.photos/300/200?random=4",
    price: 800,
    category: "СИЗ",
    sizes: [{ size: "One Size", available: true }],
  },
  {
    id: 5,
    name: "Маска медицинская",
    description: "Маска для защиты от инфекций",
    image: "https://picsum.photos/300/200?random=5",
    price: 50,
    category: "Медицина",
    sizes: [{ size: "One Size", available: true }],
  },
  {
    id: 6,
    name: "Футболка рабочая",
    description: "Футболка для рабочих",
    image: "https://picsum.photos/300/200?random=6",
    price: 300,
    category: "Спецодежда",
    sizes: [
      { size: "M", available: true },
      { size: "L", available: true },
    ],
  },
  {
    id: 7,
    name: "Кроссовки спортивные",
    description: "Кроссовки для спорта",
    image: "https://picsum.photos/300/200?random=7",
    price: 1200,
    category: "Спецобувь",
    sizes: [
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },
  {
    id: 8,
    name: "Отвертка набор",
    description: "Набор отверток для ремонта",
    image: "https://picsum.photos/300/200?random=8",
    price: 400,
    category: "Хоз товары",
    sizes: [{ size: "One Size", available: true }],
  },
  {
    id: 9,
    name: "Дрель электрическая",
    description: "Электрическая дрель для сверления",
    image: "https://picsum.photos/300/200?random=9",
    price: 2500,
    category: "Хоз товары",
    sizes: [{ size: "One Size", available: true }],
  },
  {
    id: 10,
    name: "Жилет защитный",
    description: "Жилет для защиты от ударов",
    image: "https://picsum.photos/300/200?random=10",
    price: 1500,
    category: "Защитная",
    sizes: [{ size: "One Size", available: true }],
  },
  {
    id: 11,
    name: "Костюм камуфляжный",
    description: "Костюм для маскировки",
    image: "https://picsum.photos/300/200?random=11",
    price: 3000,
    category: "Камуфляж",
    sizes: [
      { size: "M", available: true },
      { size: "L", available: true },
    ],
  },
];

const CatalogPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const categoryParam = useMemo(
    () => searchParams.get("category"),
    [searchParams]
  );

  const [categoryFilter, setCategoryFilter] = useState(categoryParam || "");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(mockProducts.map((p) => p.category))
    );
    return uniqueCategories;
  }, []);

  const filteredProducts = useMemo(() => {
    let products = mockProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-asc") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      products = products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [search, categoryFilter, sortBy]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        px: 2,
        py: 12,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f7fa",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #388e3c 100%)",
          color: "white",
          py: 4,
          px: 2,
          borderRadius: 3,
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Каталог товаров
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Поиск по названию"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={categoryFilter}
            label="Категория"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortBy}
            label="Сортировка"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="">Без сортировки</MenuItem>
            <MenuItem value="price-asc">По возрастанию цены</MenuItem>
            <MenuItem value="price-desc">По убыванию цены</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredProducts.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: "300px",
          }}
        >
          <Typography variant="h6">Товар не найден</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 3,
            flex: 1,
          }}
        >
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  borderRadius: 3,
                  boxShadow: 2,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.price} руб.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        size: product.sizes[0].size,
                        image: product.image,
                      });
                    }}
                    sx={{ mt: 1 }}
                  >
                    Добавить в корзину
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CatalogPage;
