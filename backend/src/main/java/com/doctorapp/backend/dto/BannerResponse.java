package com.doctorapp.backend.dto;

public class BannerResponse {

    private Integer bannerId;
    private String title;

    public BannerResponse(Integer bannerId, String title) {
        this.bannerId = bannerId;
        this.title = title;
    }

    public Integer getBannerId() {
        return bannerId;
    }

    public String getTitle() {
        return title;
    }
}