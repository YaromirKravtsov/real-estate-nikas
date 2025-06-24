class SearchPropertyDto {
  final String? city;
  final String? listingType;
  final String? propertyType;
  final int? priceFrom;
  final int? priceTo;
  final int page;
  final int limit;

  SearchPropertyDto({
    this.city,
    this.listingType,
    this.propertyType,
    this.priceFrom,
    this.priceTo,
    this.page = 1,
    this.limit = 10,
  });

  Map<String, String> toQueryParameters() {
    final params = <String, String>{};
    if (city != null) params['city'] = city!;
    if (listingType != null) params['listingType'] = listingType!;
    if (propertyType != null) params['propertyType'] = propertyType!;
    if (priceFrom != null) params['priceFrom'] = priceFrom.toString();
    if (priceTo != null) params['priceTo'] = priceTo.toString();
    params['page'] = page.toString();
    params['limit'] = limit.toString();
    return params;
  }
}
