
import { AppError } from "../../../common/errors/app.error.js";
import { prisma } from "../../../db.config.js";
import { AddStoreRequestDTO, StoreResponseDTO } from "../dtos/store.dtos.js";


// 가게를 데이터베이스에 추가하는 함수

export const addStore = async (regionId: number, data: AddStoreRequestDTO): Promise<number|null> => {
  try {
    const existStore = await prisma.store.findFirst({
      where: {
        name: data.name,
        regionId: regionId,
      },
    });
    if (existStore) {
      return null;
    }
    const newStore = await prisma.store.create({
      data: {
        name: data.name,
        foodCategory: data.foodCategory, 
        regionId: regionId,              
      },
    });

    
    return Number(newStore.id);
  } catch (err) {
    
    throw new AppError({
      errorCode: "STORE_ADD_FAILED",
      message: `가게 추가 중 오류 발생: ${err}`,
      statusCode: 500
    });
  }
};

// ID로 가게 정보를 조회하는 함수 
export const getStoreById = async (storeId: number): Promise<StoreResponseDTO | null> => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      
      include: {
        region: {
          select: {
            name: true, 
          },
        },
      },
    });

    
    if (!store) return null;

    return {
      id: Number(store.id),
      name: store.name,
      region: String(store.region.name), 
      foodCategory: store.foodCategory,
    };
  } catch (err) {
    throw new AppError({
      errorCode: "STORE_NOT_FOUND",
      message: `가게 조회 중 오류 발생: ${err}`,
      statusCode: 404
    });
  }
};
