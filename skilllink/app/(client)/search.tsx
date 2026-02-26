import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TechnicianCard } from "../../components/TechnicianCard";
import { useTechnicians, TechniciansSortBy } from "../../hooks/useTechnicians";
import { debounce } from "../../lib/utils";
import { COLORS } from "../../constants";

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [maxRate, setMaxRate] = useState<number | undefined>(undefined);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [sortBy, setSortBy] = useState<TechniciansSortBy>("rating");

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
      }, 300),
    []
  );

  const { technicians, isLoading, error } = useTechnicians({
    searchQuery: query,
    minRating,
    maxRate,
    availableOnly,
    sortBy,
  });

  const onChangeSearch = (value: string) => {
    setSearchText(value);
    debouncedSetQuery(value);
  };

  const resultCount = technicians.length;

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View className="px-4 pt-12 pb-3 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-800 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        </Pressable>
        <View className="flex-1 flex-row items-center bg-slate-800 rounded-xl px-3 py-2">
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            value={searchText}
            onChangeText={onChangeSearch}
            placeholder="Search services or technicians..."
            placeholderTextColor={COLORS.muted}
            className="flex-1 ml-2 text-slate-100"
          />
        </View>
        <Pressable
          onPress={() => setFiltersOpen(true)}
          className="w-9 h-9 rounded-full bg-slate-800 items-center justify-center"
        >
          <Ionicons name="options" size={18} color={COLORS.text} />
        </Pressable>
      </View>

      <View className="px-4 flex-row items-center justify-between mb-2">
        <Text className="text-slate-300 text-sm">
          {resultCount} result{resultCount === 1 ? "" : "s"} found
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isLoading ? (
          <Text className="text-slate-400 py-8 text-center">Searching…</Text>
        ) : error ? (
          <Text className="text-red-400 py-8 text-center">{error.message}</Text>
        ) : technicians.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="flash-off-outline" size={40} color={COLORS.muted} />
            <Text className="text-slate-300 mt-4 mb-1">
              No services match your search
            </Text>
            <Text className="text-slate-500 text-sm text-center px-6">
              Try adjusting your filters or searching by a different name or area.
            </Text>
          </View>
        ) : (
          technicians.map((t) => <TechnicianCard key={t.id} technician={t} />)
        )}
      </ScrollView>

      <Modal
        visible={filtersOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFiltersOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-slate-900 rounded-t-3xl p-4 pb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-slate-50 font-semibold text-lg">
                Filters
              </Text>
              <Pressable onPress={() => setFiltersOpen(false)}>
                <Text className="text-amber-400 font-medium">Done</Text>
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-slate-200 mb-2">Minimum rating</Text>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() =>
                      setMinRating(
                        minRating === star ? undefined : star
                      )
                    }
                    className={`w-9 h-9 rounded-full items-center justify-center ${
                      minRating && star <= minRating
                        ? "bg-amber-500"
                        : "bg-slate-800"
                    }`}
                  >
                    <Ionicons
                      name="star"
                      size={18}
                      color={
                        minRating && star <= minRating
                          ? "#1F2933"
                          : COLORS.muted
                      }
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-slate-200 mb-2">Max hourly rate (KES)</Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-slate-800 rounded-lg px-3 py-2">
                  <TextInput
                    value={maxRate != null ? String(maxRate) : ""}
                    onChangeText={(val) =>
                      setMaxRate(val ? Number(val) || 0 : undefined)
                    }
                    placeholder="Any"
                    placeholderTextColor={COLORS.muted}
                    keyboardType="numeric"
                    className="text-slate-100"
                  />
                </View>
                {maxRate != null && (
                  <Pressable onPress={() => setMaxRate(undefined)}>
                    <Text className="text-slate-400 text-sm">Clear</Text>
                  </Pressable>
                )}
              </View>
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-slate-200">Available now only</Text>
              <Pressable
                onPress={() => setAvailableOnly((v) => !v)}
                className={`w-11 h-6 rounded-full px-1 flex-row items-center ${
                  availableOnly ? "bg-amber-500" : "bg-slate-700"
                }`}
              >
                <View
                  className={`w-4 h-4 rounded-full bg-slate-900 transform ${
                    availableOnly ? "translate-x-4" : ""
                  }`}
                />
              </Pressable>
            </View>

            <View className="mb-1">
              <Text className="text-slate-200 mb-2">Sort by</Text>
              <View className="flex-row gap-2">
                {[
                  { key: "rating", label: "Rating" },
                  { key: "price_asc", label: "Price (low–high)" },
                  { key: "price_desc", label: "Price (high–low)" },
                ].map((opt) => (
                  <Pressable
                    key={opt.key}
                    onPress={() => setSortBy(opt.key as TechniciansSortBy)}
                    className={`px-3 py-1.5 rounded-full border ${
                      sortBy === opt.key
                        ? "bg-amber-500 border-amber-400"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    <Text
                      className={
                        sortBy === opt.key
                          ? "text-slate-900 text-xs font-semibold"
                          : "text-slate-200 text-xs"
                      }
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
