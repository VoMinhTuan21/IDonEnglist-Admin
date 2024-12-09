import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { Category } from '../../features/category/models/category.model';

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
  updateCategoryInTree: (
    categories: Category[],
    updatedCategory: Category
  ): Category[] => {
    return categories.map((category) => {
      // If the current category matches the updated category, return the updated one
      if (category.id === updatedCategory.id) {
        return updatedCategory;
      }

      // If the category has children, recursively update them
      if (category.children) {
        return {
          ...category,
          children: Utils.updateCategoryInTree(
            category.children,
            updatedCategory
          ),
        };
      }

      // Return the category as is if no match is found
      return category;
    });
  },
  deleteCategoryInTree: (
    categories: Category[],
    idToRemove: number
  ): Category[] => {
    return categories
      .filter((category) => category.id !== idToRemove) // Remove the category with the matching id
      .map((category) => {
        // If there are children, recursively remove the category from children
        if (category.children) {
          category.children = Utils.deleteCategoryInTree(
            category.children,
            idToRemove
          );
        }
        return category;
      });
  },
  beforeImageUpload: (
    msg: NzMessageService,
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    }),
  cleanObject(
    obj: Record<string, any>,
    fieldsToKeep: string[] = []
  ): Record<string, any> {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([key, value]) =>
          fieldsToKeep.includes(key) ||
          (value !== null && value !== '' && value !== 0)
      )
    );
  },
  beforeAudioUpload: (
    msg: NzMessageService,
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isMp3OrWav =
        file.type === 'audio/mpeg' || file.type === 'audio/wav';
      if (!isMp3OrWav) {
        msg.error('You can only upload MP3 or WAV files!');
        observer.complete();
        return;
      }
      const isLt5M = file.size! / 1024 / 1024 < 5;
      if (!isLt5M) {
        msg.error('Audio file must be smaller than 5MB!');
        observer.complete();
        return;
      }
      observer.next(isMp3OrWav && isLt5M);
      observer.complete();
    }),
  replaceInputTags: (inputString: string): string => {
    // Use a regular expression to replace <input> tags with "__BLANK__"
    const result = inputString.replace(/<input[^>]*>/g, '__BLANK__');
    return result;
  },
  fillInBlanks: (template: string, answers: string[]): string => {
    // Use a regular expression to replace "__BLANK__" with values from the answers array
    let index = 0;
    const result = template.replace(/__BLANK__/g, () => {
        // Replace with the corresponding answer if available
        return index < answers.length ? `<input type="text" class="fill-in-blank-text-editor__blank-box" placeholder="Type answer..." value="${answers[index++]}">` : '__BLANK__';
    });
    return result;
}
};
