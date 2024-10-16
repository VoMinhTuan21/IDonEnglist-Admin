import { Category } from "../../features/category/models/category.model";

export const Utils = {
  findCategoryInTree: (categories: Category[], id: number): Category | null => {
    for (const category of categories) {
      // Check if the current category matches the id and has no children
      if (category.id === id) {
        return category;
      }
  
      // If there are children, search recursively
      if (category.children) {
        const found = Utils.findCategoryInTree(category.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  },
  updateCategoryInTree: (categories: Category[], updatedCategory: Category): Category[] => {
    return categories.map(category => {
      // If the current category matches the updated category, return the updated one
      if (category.id === updatedCategory.id) {
        return updatedCategory;
      }
  
      // If the category has children, recursively update them
      if (category.children) {
        return {
          ...category,
          children: Utils.updateCategoryInTree(category.children, updatedCategory)
        };
      }
  
      // Return the category as is if no match is found
      return category;
    });
  },
  deleteCategoryInTree: (categories: Category[], idToRemove: number): Category[] => {
    return categories
      .filter(category => category.id !== idToRemove) // Remove the category with the matching id
      .map(category => {
        // If there are children, recursively remove the category from children
        if (category.children) {
          category.children = Utils.deleteCategoryInTree(category.children, idToRemove);
        }
        return category;
      });
  }
}