from setuptools import setup, find_packages

setup(
    name="trackyourapi",
    version="0.1.0",
    description="Official Python SDK for TrackYourAPI — AI API usage tracking",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="TrackYourAPI",
    license="MIT",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[],  # zero hard dependencies — uses stdlib only
    extras_require={
        "openai": ["openai>=1.0.0"],
        "anthropic": ["anthropic>=0.20.0"],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Topic :: Software Development :: Libraries",
    ],
)
