'use client'

import { useQuery } from '@tanstack/react-query'
import { searchPhotosAction, getPlacePhotosAction, getCityPhotoAction } from '@/app/actions/photos'
import type { PhotoSearchParams, PlacePhotoParams } from '@/types/photo'

export function usePhotoSearch(params: PhotoSearchParams | null) {
  const query = useQuery({
    queryKey: ['photos', 'search', params?.query, params?.page, params?.perPage, params?.orientation],
    queryFn: () => searchPhotosAction(params!),
    enabled: !!params?.query,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    retry: false,
  })
  const result = query.data
  return {
    photos: result?.ok ? result.data.photos : [],
    totalResults: result?.ok ? result.data.totalResults : 0,
    provider: result?.ok ? result.data.provider : null,
    error: result && !result.ok ? result.error : null,
    isLoading: query.isPending,
  }
}

export function usePlacePhotos(params: PlacePhotoParams | null) {
  const query = useQuery({
    queryKey: ['photos', 'place', params?.placeId],
    queryFn: () => getPlacePhotosAction(params!),
    enabled: !!params?.placeId,
    staleTime: 60 * 60_000,
    gcTime: 2 * 60 * 60_000,
    retry: false,
  })
  const result = query.data
  return {
    photos: result?.ok ? result.data : [],
    error: result && !result.ok ? result.error : null,
    isLoading: query.isPending,
  }
}

export function useCityPhoto(cityName: string | null) {
  const query = useQuery({
    queryKey: ['photos', 'city', cityName],
    queryFn: () => getCityPhotoAction(cityName!),
    enabled: !!cityName,
    staleTime: 24 * 60 * 60_000,
    gcTime: 7 * 24 * 60 * 60_000,
    retry: false,
  })
  const result = query.data
  return {
    photo: result?.ok ? result.data : null,
    error: result && !result.ok ? result.error : null,
    isLoading: query.isPending,
  }
}
