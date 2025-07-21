// CreatePage.jsx (excerpt)
import {
  Input,
  Button,
  VStack,
  Container,
  Box,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";

export default function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    imageUrl: "",
  });
  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
    }
    setNewProduct({ name: "", price: 0, imageUrl: "" }); // Reset form
    // window.location.reload(); // Refresh the page to see the new product
  };

  return (
    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading>Create New Product</Heading>
        <Box w="full" p={6} rounded="lg" shadow="md">
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setNewProduct({
                  ...newProduct,
                  price: isNaN(val) ? 0 : val,
                });
              }}
            />
            <Input
              placeholder="Image URL"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
            <Button colorScheme="blue" w="full" onClick={handleAddProduct}>
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
