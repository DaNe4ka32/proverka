import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import type { Product, Comment } from "../types/product";

// Моковые данные товаров (скопировано из CatalogPage для независимости)
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Куртка строительная",
    description: "Куртка для строителей",
    fullDescription:
      "Высококачественная куртка для строителей, изготовленная из прочного материала. Обеспечивает защиту от холода, ветра и влаги. Идеально подходит для работы на открытом воздухе в холодное время года. Доступна в размерах M и L.",
    image: "https://picsum.photos/300/200?random=1",
    price: 1500,
    category: "Строительная",
    sizes: [
      { size: "M", available: true },
      { size: "L", available: false },
    ],
  },
  {
    id: 2,
    name: "Перчатки медицинские",
    description: "Перчатки для медицинского персонала",
    fullDescription:
      "Латексные перчатки для медицинского использования. Обеспечивают гигиену и защиту от инфекций. Подходят для хирургических процедур и общего медицинского ухода. Доступны в размерах S и M.",
    image: "https://picsum.photos/300/200?random=2",
    price: 200,
    category: "Медицинская",
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
    ],
  },
  {
    id: 3,
    name: "Ботинки рабочие",
    description: "Ботинки для работы",
    fullDescription:
      "Прочные рабочие ботинки с защитой от ударов и проколов. Изготовлены из натуральной кожи с металлическим носком. Обеспечивают комфорт и безопасность на строительных площадках. Доступны в размерах 42 и 43.",
    image: "https://picsum.photos/300/200?random=3",
    price: 2500,
    category: "Строительная",
    sizes: [
      { size: "42", available: true },
      { size: "43", available: true },
    ],
  },
  // Добавьте больше товаров по необходимости
];

const ProductPage: React.FC = () => {
  console.log("ProductPage rendered");
  const { id } = useParams<{ id: string }>();
  console.log("ProductPage: id from params:", id);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const productId = parseInt(id || "0");
  console.log("ProductPage: parsed productId:", productId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${productId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [productId]);
  const product = mockProducts.find((p) => p.id === productId);
  console.log("ProductPage: found product:", product);

  if (!product) {
    return (
      <Box sx={{ mt: 4, mb: 4, width: "100%", px: 2 }}>
        <Typography variant="h4">Товар не найден</Typography>
      </Box>
    );
  }

  const handleAddToCart = (size: string) => {
    console.log("ProductPage: handleAddToCart called with size:", size);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      image: product.image,
    });
  };

  const handleAddComment = async () => {
    if (newComment.trim() && user) {
      try {
        const response = await axios.post("/api/comments", {
          productId,
          user: user.name || user.email,
          text: newComment.trim(),
        });
        setComments([...comments, response.data]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const similarProducts = mockProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

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
          {product.name}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          {product.fullDescription && (
            <Typography variant="body2" paragraph sx={{ mb: 2 }}>
              {product.fullDescription}
            </Typography>
          )}
          <Typography variant="h6" color="primary" gutterBottom>
            Цена: {product.price} руб.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={!product.sizes.some((s) => s.available)}
            onClick={() => {
              const availableSize = product.sizes.find((s) => s.available);
              if (availableSize) {
                handleAddToCart(availableSize.size);
              }
            }}
            sx={{ mb: 2 }}
          >
            Добавить в корзину
          </Button>
          <Typography variant="h6" gutterBottom>
            Размерная сетка:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
            {product.sizes.map((size) => (
              <Button
                key={size.size}
                variant={size.available ? "outlined" : "contained"}
                disabled={!size.available}
                color={size.available ? "primary" : "secondary"}
                onClick={() => handleAddToCart(size.size)}
              >
                {size.size}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {similarProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Похожие товары
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 3,
            }}
          >
            {similarProducts.map((similarProduct) => (
              <Link
                key={similarProduct.id}
                to={`/product/${similarProduct.id}`}
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
                    height="150"
                    image={similarProduct.image}
                    alt={similarProduct.name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {similarProduct.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {similarProduct.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {similarProduct.price} руб.
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Отзывы
        </Typography>
        {comments.map((comment) => (
          <Card key={comment.id} sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">
                {comment.user}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {comment.date}
              </Typography>
              <Typography variant="body1">{comment.text}</Typography>
            </CardContent>
          </Card>
        ))}
        {isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Ваш отзыв"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Добавить отзыв
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductPage;
