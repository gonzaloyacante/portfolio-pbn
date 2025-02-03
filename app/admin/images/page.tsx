// "use client";

// import { useEffect, useState } from "react";
// import { db } from "@/lib/firebaseClient";
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   query,
//   orderBy,
//   addDoc,
// } from "firebase/firestore";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "react-beautiful-dnd";
// import { Image } from "@/models/GalleryImage";
// import AdminLayout from "@/components/AdminLayout";
// import { Loader } from "@/components/Loader";
// import NoData from "@/components/NoData";
// import { Button } from "@/components/ui/button";

// const AdminImages = () => {
//   const [images, setImages] = useState<Image[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const q = query(collection(db, "homeGallery"), orderBy("order"));
//         const querySnapshot = await getDocs(q);
//         const imagesData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Image[];
//         setImages(imagesData);
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImages();
//   }, []);

//   const handleDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;

//     const reorderedImages = Array.from(images);
//     const [movedImage] = reorderedImages.splice(result.source.index, 1);
//     reorderedImages.splice(result.destination.index, 0, movedImage);

//     setImages(reorderedImages);

//     // Actualizar el campo `order` en Firebase
//     reorderedImages.forEach(async (image, index) => {
//       const imageRef = doc(db, "homeGallery", image.id);
//       await updateDoc(imageRef, { order: index + 1 });
//     });
//   };

//   const handleAddImage = async () => {
//     const newImage: Image = {
//       id: "",
//       url: "https://via.placeholder.com/150",
//       name: "Nueva Imagen",
//       order: images.length + 1,
//     };

//     try {
//       const docRef = await addDoc(collection(db, "homeGallery"), newImage);
//       newImage.id = docRef.id;
//       setImages([...images, newImage]);
//     } catch (error) {
//       console.error("Error adding image:", error);
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <AdminLayout title="Administrar Imágenes">
//       <Button onClick={handleAddImage} className="mb-4">
//         Agregar Imagen
//       </Button>
//       {images.length === 0 ? (
//         <NoData message="No hay imágenes disponibles." />
//       ) : (
//         <DragDropContext onDragEnd={handleDragEnd}>
//           <Droppable droppableId="images">
//             {(provided) => (
//               <div {...provided.droppableProps} ref={provided.innerRef}>
//                 {images.map((image, index) => (
//                   <Draggable
//                     key={image.id}
//                     draggableId={image.id}
//                     index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="p-2 border rounded mb-2 flex items-center justify-between">
//                         <div className="flex items-center">
//                           <span className="mr-4">{index + 1}</span>
//                           <img
//                             src={image.url}
//                             alt={image.name}
//                             className="w-16 h-16 mr-4"
//                           />
//                           <p>{image.name}</p>
//                         </div>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       )}
//     </AdminLayout>
//   );
// };

// export default AdminImages;
