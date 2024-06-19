export interface ICategoriesProps {
  id: string;
  name: string;
  parentId: string;
  path: string;
  children?: ICategoriesProps[];
}

export const withPath = (categories: ICategoriesProps[]) => {
  const getParent = (categories: ICategoriesProps[], parentId: string) => {
    const parent = categories.filter((parent) => parent.id === parentId);
    return parent.length ? parent[0] : null;
  };

  const categoriesWithPath = categories.map((category) => {
    let path = category.name;
    let parent = getParent(categories, category.parentId);

    while (parent) {
      path = `${parent.name}/${path}`;
      parent = getParent(categories, parent.parentId);
    }

    return { ...category, path };
  });
  categoriesWithPath.sort((a, b) => {
    if (a.path.toLowerCase() < b.path.toLowerCase()) return -1;
    if (a.path.toLowerCase() > b.path.toLowerCase()) return 1;
    return 0;
  });

  return categoriesWithPath;
};
