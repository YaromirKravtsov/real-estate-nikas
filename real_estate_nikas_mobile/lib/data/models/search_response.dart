class SearchResponse<T> {
  final int total;
  final int page;
  final int limit;
  final List<T> data;

  SearchResponse({
    required this.total,
    required this.page,
    required this.limit,
    required this.data,
  });

  factory SearchResponse.fromJson(
      Map<String, dynamic> json,
      T Function(Map<String, dynamic>) fromJsonT,
      ) {
    return SearchResponse<T>(
      total: json['total'],
      page: json['page'],
      limit: json['limit'],
      data: List<T>.from(json['data'].map((item) => fromJsonT(item))),
    );
  }
}
