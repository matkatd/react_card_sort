"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Toolbar,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";

type Quote = {
  id: number;
  quote: string;
  categories: string[];
  subcategories: string[];
};

const QuotesComponent = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categories, setCategories] = useState([""]);
  const [subcategories, setSubcategories] = useState([""]);

  useEffect(() => {
    // Fetch quotes from the external JSON file
    fetch("/quotes.json")
      .then((response) => response.json())
      .then((data) => {
        setQuotes(data);
        // Extract unique categories
        const uniqueCategories = [
          ...new Set<string>(data.flatMap((quote: Quote) => quote.categories)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching quotes:", error));
  }, []);

  useEffect(() => {
    // Filter subcategories based on the selected category
    const filteredSubcategories = quotes
      .filter((quote: Quote) => quote.categories.includes(selectedCategory))
      .flatMap((quote: Quote) => quote.subcategories);

    // Extract unique subcategories
    const uniqueSubcategories = [...new Set(filteredSubcategories)];
    setSubcategories(uniqueSubcategories);
  }, [selectedCategory, quotes]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    // Reset subcategory when changing category
    setSelectedSubcategory("");
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedSubcategory(event.target.value);
  };
  return (
    <div>
      <Toolbar
        sx={{ background: "#1cd968", borderRadius: "5px", padding: "1rem" }}
      >
        <FormControl fullWidth sx={{ pr: "1rem" }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            sx={{ background: "#31ad62", opacity: 0.8 }}
            variant="filled"
            labelId="category-select-label"
            fullWidth
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="subcategory-select-label">Subcategory</InputLabel>
          <Select
            variant="filled"
            sx={{ background: "#31ad62", opacity: 0.8 }}
            labelId="subcategory-select-label"
            fullWidth
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            <MenuItem value="">All Subcategories</MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory} value={subcategory}>
                {subcategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Toolbar>

      {/* Render quotes based on selected category and subcategory */}
      {quotes
        .filter(
          (quote: Quote) =>
            (!selectedCategory ||
              quote.categories.includes(selectedCategory)) &&
            (!selectedSubcategory ||
              quote.subcategories.includes(selectedSubcategory))
        )
        .map((quote: Quote) => (
          <Card key={quote.id} style={{ margin: "16px" }}>
            <CardContent>
              <Typography variant="body1" component="div">
                {quote.quote}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Categories: {quote.categories.join(", ")}
              </Typography>
              <Typography color="textSecondary">
                Subcategories: {quote.subcategories.join(", ")}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default QuotesComponent;
