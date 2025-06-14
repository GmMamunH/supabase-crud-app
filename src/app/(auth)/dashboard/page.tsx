"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { useAppHook } from "@/app/context/AppUtils";
import { toast, ToastContainer } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductType {
  id?: number;
  title: string;
  content: string;
  cost: string;
  banner_image?: string | File | null;
}

const formSchema = yup.object().shape({
  title: yup.string().required("Product title is required"),
  content: yup.string().required("Description is required"),
  cost: yup.string().required("Product cost is required"),
});

export default function Dashboard() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const {
    setAuthToken,
    setIsLoggedIn,
    isLoggedIn,
    setUserProfile,
    setIsLoading,
  } = useAppHook();
  const router = useRouter();

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast.error("Failed to get user data");
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      setAuthToken(data.session.access_token);
      setUserId(data.session.user.id);
      localStorage.setItem("access_token", data.session.access_token);
      setIsLoggedIn(true);
      setUserProfile({
        id: data.session.user.id,
        name: data.session.user.user_metadata.username,
        email: data.session.user.user_metadata.email,
        gender: data.session.user.user_metadata.gender,
        phone: data.session.user.user_metadata.phone,
      });
      localStorage.setItem(
        "user_profile",
        JSON.stringify({
          name: data.session.user.user_metadata.username,
          email: data.session.user.user_metadata.email,
          gender: data.session.user.user_metadata.gender,
          phone: data.session.user.user_metadata.phone,
        })
      );

      fetchProductsFromTable(data.session.user.id);
      setIsLoading(false);
    };

    handleLoginSession();

    if (!isLoggedIn) {
      router.push("/sign-in");
    }
  }, []);

  const uploadImageFile = async (file: File) => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const { data, error } = await supabase.storage
      .from("product-image")
      .upload(fileName, file);

      console.log(
        "Upload Data: ", data,
        "Upload Error: ", error
      );
      

    if (error) {
      toast.error("Failed to upload banner image");
      return null;
    }

    return supabase.storage.from("product-image").getPublicUrl(fileName).data
      .publicUrl;
  };

  const onFormSubmit = async (formData: ProductType) => {
    setIsLoading(true);
    let imagePath = formData.banner_image;

    if (formData.banner_image instanceof File) {
      imagePath = await uploadImageFile(formData.banner_image);
      if (!imagePath) {
        setIsLoading(false);
        return;
      }
    }

    if (editId) {
      const { error } = await supabase
        .from("products")
        .update({ ...formData, banner_image: imagePath })
        .match({ id: editId, user_id: userId });

      if (error) {
        toast.error("Failed to update product data");
      } else {
        toast.success("Product has been updated successfully");
      }
    } else {
      const { error } = await supabase.from("products").insert({
        ...formData,
        user_id: userId,
        banner_image: imagePath,
      });

      if (error) {
        toast.error("Failed to Add Product");
      } else {
        toast.success("Successfully Product has been created!");
      }

      reset();
    }

    setPreviewImage(null);
    fetchProductsFromTable(userId!);
    setIsLoading(false);
  };

  const fetchProductsFromTable = async (userId: string) => {
    setIsLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId);
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const handleEditData = (product: ProductType) => {
    setValue("title", product?.title ?? "");
    setValue("content", product?.content ?? "");
    setValue("cost", product?.cost ?? "");
    // Manually cast as string because banner_image can be string | File | null
    setValue("banner_image", product?.banner_image as string);
    setPreviewImage(product?.banner_image as string);
    if (product?.id !== undefined && product?.id !== null) {
      setEditId(product.id);
    } else {
      setEditId(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("products").delete().match({
          id,
          user_id: userId,
        });

        if (error) {
          toast?.error("Failed to delete product");
        } else {
          toast?.success("Product deleted successfully");
        }

        fetchProductsFromTable(userId!);
      }
    });
  };

  return (
    <div className="container mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{editId ? "Edit Product" : "Add Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              <p className="text-red-500 text-sm">{errors.title?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Input id="content" {...register("content")} />
              <p className="text-red-500 text-sm">{errors.content?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" {...register("cost")} />
              <p className="text-red-500 text-sm">{errors.cost?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image</Label>
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={100}
                  height={100}
                />
              )}
              <Input
                id="banner"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("banner_image", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <Button type="submit" className="w-full">
              {editId ? "Update Product" : "Add Product"}
            </Button>
            <ToastContainer />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.content}</TableCell>
                    <TableCell>${product.cost}</TableCell>
                    <TableCell>
                      {product.banner_image ? (
                        <Image
                          src={product.banner_image as string}
                          alt="Product"
                          width={50}
                          height={50}
                        />
                      ) : (
                        "--"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEditData(product)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id!)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
